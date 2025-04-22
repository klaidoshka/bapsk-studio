using Accounting.Contract;
using Accounting.Contract.Dto;
using Accounting.Contract.Entity;
using Accounting.Contract.Validator;
using Accounting.Services.Util;
using Microsoft.EntityFrameworkCore;
using Salesman = Accounting.Contract.Dto.Salesman.Salesman;

namespace Accounting.Services.Validator;

public class SalesmanValidator : ISalesmanValidator
{
    private readonly AccountingDatabase _database;
    private readonly IInstanceValidator _instanceValidator;

    public SalesmanValidator(AccountingDatabase database, IInstanceValidator instanceValidator)
    {
        _database = database;
        _instanceValidator = instanceValidator;
    }

    public Validation ValidateSalesman(Salesman salesman)
    {
        var failures = new List<string>();

        if (String.IsNullOrWhiteSpace(salesman.Name))
        {
            failures.Add("Salesman's name must be provided.");
        }

        return new Validation(failures);
    }

    public async Task<Validation> ValidateDeleteRequestAsync(int salesmanId)
    {
        return await ValidateExistsAsync(salesmanId);
    }

    public async Task<Validation> ValidateEditRequestAsync(Salesman salesman)
    {
        if (salesman.Id == null)
        {
            return new Validation("Salesman ID must be provided.");
        }

        var existsValidation = await ValidateExistsAsync(salesman.Id!.Value);

        return !existsValidation.IsValid
            ? existsValidation
            : ValidateSalesman(salesman);
    }

    public async Task<Validation> ValidateExistsAsync(int salesmanId)
    {
        return await _database.Salesmen.AnyAsync(it => it.Id == salesmanId && !it.IsDeleted)
            ? new Validation()
            : new Validation("Salesman was not found.");
    }

    public async Task<Validation> ValidateGetByIdRequestAsync(int salesmanId)
    {
        return await ValidateExistsAsync(salesmanId);
    }

    public async Task<Validation> ValidateGetRequestAsync(int instanceId)
    {
        return await _instanceValidator.ValidateExistsAsync(instanceId);
    }

    public Validation ValidateVatReturnSalesman(Salesman salesman)
    {
        var failures = new List<string>();

        ValidateSalesman(salesman)
            .Also(it => failures.AddRange(it.FailureMessages));

        if (salesman.Name.Length is < 1 or > 300)
        {
            failures.Add("Salesman's name must be between 1 and 300 characters.");
        }

        if (salesman.VatPayerCode.IssuedBy != IsoCountryCode.LT)
        {
            failures.Add("Salesman's VAT payer code must be issued by Lithuania.");
        }

        var vatPayerCodeLength = salesman.VatPayerCode.Value.Length;

        if (vatPayerCodeLength != 12 && vatPayerCodeLength != 9 || !salesman.VatPayerCode.Value.All(Char.IsDigit))
        {
            failures.Add("Salesman's VatPayerCode must be made out of 9 or 12 digits.");
        }

        return new Validation(failures);
    }

    public async Task<bool> IsFromInstanceAsync(int id, int instanceId)
    {
        var salesman = await _database.Salesmen.FindAsync(id);

        return salesman?.IsDeleted == false && salesman.InstanceId == instanceId;
    }
}