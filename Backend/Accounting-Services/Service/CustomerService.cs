using Accounting.Contract;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Customer;
using Accounting.Contract.Service;
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
                IdentityDocument = request.Customer.IdentityDocument.Value,
                IdentityDocumentIssuedBy = request.Customer.IdentityDocument.IssuedBy,
                IdentityDocumentType = request.Customer.IdentityDocument.Type,
                InstanceId = request.InstanceId,
                LastName = request.Customer.LastName
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

        var customer = await _database.Customers.FirstAsync(it => it.Id == request.Customer.Id);

        customer.Birthdate = request.Customer.Birthdate;
        customer.FirstName = request.Customer.FirstName;
        customer.IdentityDocument = request.Customer.IdentityDocument.Value;
        customer.IdentityDocumentIssuedBy = request.Customer.IdentityDocument.IssuedBy;
        customer.IdentityDocumentType = request.Customer.IdentityDocument.Type;
        customer.LastName = request.Customer.LastName;

        await _database.SaveChangesAsync();
    }

    public async Task<IEnumerable<Customer>> GetAsync(CustomerGetRequest request)
    {
        // Validate if instance exists
        // Validate if requester can access the instance

        if (request.InstanceId is not null)
        {
            return await _database.Customers
                .Where(it => !it.IsDeleted && it.InstanceId == request.InstanceId)
                .ToListAsync();
        }

        var instanceIds = await _database.InstanceUserMetas
            .Where(it => it.UserId == request.RequesterId)
            .Select(it => it.InstanceId)
            .ToHashSetAsync();

        return (await _database.Customers
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
        return await _database.Customers.FirstOrDefaultAsync(it => it.Id == id && !it.IsDeleted)
               ?? throw new ValidationException("Customer not found");
    }
}