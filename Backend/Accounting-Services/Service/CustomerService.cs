using Accounting.Contract;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Customer;
using Accounting.Contract.Service;
using Accounting.Services.Util;
using Microsoft.EntityFrameworkCore;
using Customer = Accounting.Contract.Entity.Customer;

namespace Accounting.Services.Service;

public class CustomerService : ICustomerService
{
    private readonly AccountingDatabase _database;

    public CustomerService(AccountingDatabase database)
    {
        _database = database;
    }

    public async Task<Customer> CreateAsync(CustomerCreateRequest request)
    {
        // Validate if instance exists
        // Validate if requester can access the instance
        // Validate properties

        var customer = (await _database.Customers.AddAsync(
            new Customer
            {
                Birthdate = request.Customer.Birthdate,
                FirstName = request.Customer.FirstName,
                IdentityDocumentIssuedBy = request.Customer.IdentityDocument.IssuedBy,
                IdentityDocumentNumber = request.Customer.IdentityDocument.Number,
                IdentityDocumentType = request.Customer.IdentityDocument.Type,
                IdentityDocumentValue = request.Customer.IdentityDocument.Value,
                InstanceId = request.InstanceId,
                LastName = request.Customer.LastName,
                OtherDocuments = request.Customer.OtherDocuments
                    .Select(it => it.ToEntity())
                    .ToList(),
                ResidenceCountry = request.Customer.ResidenceCountry
            }
        )).Entity;

        await _database.SaveChangesAsync();

        return customer;
    }

    public async Task DeleteAsync(CustomerDeleteRequest request)
    {
        // Validate if instance exists
        // Validate if requester can access the instance
        // Validate if customer exists

        var customer = await _database.Customers.FirstAsync(it => it.Id == request.CustomerId);

        customer.IsDeleted = true;

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(CustomerEditRequest request)
    {
        // Validate if instance exists
        // Validate if requester can access the instance
        // Validate if customer exists
        // Validate properties

        var customer = await _database.Customers
            .Include(it => it.OtherDocuments)
            .FirstAsync(it => it.Id == request.Customer.Id);

        customer.Birthdate = request.Customer.Birthdate;
        customer.FirstName = request.Customer.FirstName;
        customer.IdentityDocumentNumber = request.Customer.IdentityDocument.Number;
        customer.IdentityDocumentIssuedBy = request.Customer.IdentityDocument.IssuedBy;
        customer.IdentityDocumentType = request.Customer.IdentityDocument.Type;
        customer.IdentityDocumentValue = request.Customer.IdentityDocument.Value;
        customer.LastName = request.Customer.LastName;

        var documentsCurrent = customer.OtherDocuments.ToDictionary(it => it.Id);

        var documentsNew = request.Customer.OtherDocuments
            .ToDictionary(it => it.Id)
            .Where(it => !documentsCurrent.ContainsKey(it.Key))
            .ToDictionary(it => it.Key, it => it.Value);

        foreach (var document in documentsNew)
        {
            customer.OtherDocuments.Add(document.Value.ToEntity());
        }

        var documentsProvided = request.Customer.OtherDocuments.ToDictionary(it => it.Id);

        var otherDocumentsMissing = documentsCurrent
            .Where(it => !documentsProvided.ContainsKey(it.Key))
            .Select(it => it.Value)
            .ToList();

        foreach (var document in otherDocumentsMissing)
        {
            customer.OtherDocuments.Remove(document);
        }

        documentsProvided
            .Where(it => !documentsNew.ContainsKey(it.Key))
            .Select(it => it.Value)
            .ToList()
            .ForEach(
                it => documentsCurrent[it.Id]
                    .Also(
                        document =>
                        {
                            document.IssuedBy = it.IssuedBy;
                            document.Type = it.Type;
                            document.Value = it.Value;
                        }
                    )
            );

        await _database.SaveChangesAsync();
    }

    public async Task<IEnumerable<Customer>> GetAsync(CustomerGetRequest request)
    {
        // Validate if instance exists
        // Validate if requester can access the instance

        if (request.InstanceId is not null)
        {
            return await _database.Customers
                .Include(it => it.OtherDocuments)
                .Where(it => !it.IsDeleted && it.InstanceId == request.InstanceId)
                .ToListAsync();
        }

        var instanceIds = await _database.InstanceUserMetas
            .Where(it => it.UserId == request.RequesterId)
            .Select(it => it.InstanceId)
            .ToHashSetAsync();

        return (await _database.Customers
                .Include(it => it.OtherDocuments)
                .Where(
                    it => !it.IsDeleted &&
                          it.InstanceId != null
                )
                .ToListAsync())
            .Where(it => instanceIds.Contains(it.InstanceId!.Value))
            .ToList();
    }

    public async Task<Customer> GetByIdAsync(int id)
    {
        return await _database.Customers
                   .Include(it => it.OtherDocuments)
                   .FirstOrDefaultAsync(it => it.Id == id && !it.IsDeleted)
               ?? throw new ValidationException("Customer not found");
    }
}