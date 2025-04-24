using System.Text.RegularExpressions;
using Accounting.Contract;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Sti;
using Accounting.Contract.Validator;
using Accounting.Services.Util;
using Microsoft.EntityFrameworkCore;
using Customer = Accounting.Contract.Dto.Customer.Customer;

namespace Accounting.Services.Validator;

public class CustomerValidator : ICustomerValidator
{
    private static readonly DateTime CustomerVatReturnMinimalBirthdate = DateTime.Parse("1920-01-01");

    private readonly AccountingDatabase _database;
    private readonly IInstanceValidator _instanceValidator;

    public CustomerValidator(AccountingDatabase database, IInstanceValidator instanceValidator)
    {
        _database = database;
        _instanceValidator = instanceValidator;
    }

    public Validation ValidateCustomer(Customer customer)
    {
        var failures = new List<string>();

        if (String.IsNullOrWhiteSpace(customer.FirstName) && String.IsNullOrWhiteSpace(customer.LastName))
        {
            failures.Add("Customer's first or last name must be provided.");
        }

        if (!String.IsNullOrWhiteSpace(customer.Email) && !new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$").IsMatch(customer.Email))
        {
            failures.Add("Customer's email is invalid.");
        }

        if (String.IsNullOrWhiteSpace(customer.IdentityDocument.Number))
        {
            failures.Add("Customer's identity document number must be provided.");
        }

        return new Validation(failures);
    }

    public async Task<Validation> ValidateDeleteRequestAsync(int customerId)
    {
        return await ValidateExistsAsync(customerId);
    }

    public async Task<Validation> ValidateEditRequestAsync(Customer customer)
    {
        if (customer.Id == null)
        {
            return new Validation("Customer ID must be provided.");
        }

        var existsValidation = await ValidateExistsAsync(customer.Id!.Value);

        return !existsValidation.IsValid
            ? existsValidation
            : ValidateCustomer(customer);
    }

    public async Task<Validation> ValidateExistsAsync(int customerId)
    {
        return await _database.Customers.AnyAsync(it => it.Id == customerId && !it.IsDeleted)
            ? new Validation()
            : new Validation("Customer was not found.");
    }

    public async Task<Validation> ValidateGetByIdRequestAsync(int customerId)
    {
        return await ValidateExistsAsync(customerId);
    }

    public async Task<Validation> ValidateGetRequestAsync(int instanceId)
    {
        return await _instanceValidator.ValidateExistsAsync(instanceId);
    }

    public Validation ValidateVatReturnCustomer(Customer customer)
    {
        var failures = new List<string>();

        ValidateCustomer(customer)
            .Also(it => failures.AddRange(it.FailureMessages));

        if (customer.Birthdate < CustomerVatReturnMinimalBirthdate || customer.Birthdate > DateTime.UtcNow.AddYears(-18))
        {
            failures.Add("Customer must be at least 18 years old.");
        }

        if (customer.FirstName.Length > 200 || customer.LastName.Length > 200)
        {
            failures.Add("Customer's first and last name must have less than 200 characters.");
        }

        if (!String.IsNullOrWhiteSpace(customer.IdentityDocument.Value) && customer.IdentityDocument.Value.Length > 50)
        {
            failures.Add("Customer's ID value (personal code) must have less than 50 characters.");
        }

        if (customer.IdentityDocument.Number.Length is < 1 or > 50)
        {
            failures.Add("Customer's ID number must be between 1 and 50 characters.");
        }

        if (customer.ResidenceCountry.ConvertToEnumOrNull<NonEuCountryCode>() == null)
        {
            failures.Add("Customer's residence country must be a non-EU country.");
        }

        var nonEuCountry = customer.IdentityDocument.IssuedBy.ConvertToEnumOrNull<NonEuCountryCode>();
        var otherDocuments = customer.OtherDocuments.ToList();

        if (nonEuCountry is null or NonEuCountryCode.GB && otherDocuments.Count == 0)
        {
            failures.Add("Customer's other documents are required if ID is issued by EU country or United Kingdom.");
        }

        for (var i = 0; i < otherDocuments.Count; i++)
        {
            var document = otherDocuments[i];

            if (document.Type.Length is < 1 or > 100)
            {
                failures.Add($"Customer's other document #{i + 1} type must be between 1 and 100 characters.");
            }

            if (document.Value.Length is < 1 or > 50)
            {
                failures.Add($"Customer's other document #{i + 1} number must be between 1 and 50 characters.");
            }
        }

        return new Validation(failures);
    }

    public async Task<bool> IsFromInstanceAsync(int id, int instanceId)
    {
        var customer = await _database.Customers.FindAsync(id);

        if (customer?.IsDeleted == true)
        {
            throw new KeyNotFoundException("Customer was not found.");
        }

        return customer?.IsDeleted == false && customer.InstanceId == instanceId;
    }
}