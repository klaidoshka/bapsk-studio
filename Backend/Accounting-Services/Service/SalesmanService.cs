using Accounting.Contract;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Salesman;
using Accounting.Contract.Service;
using Microsoft.EntityFrameworkCore;
using Salesman = Accounting.Contract.Entity.Salesman;

namespace Accounting.Services.Service;

public class SalesmanService : ISalesmanService
{
    private readonly AccountingDatabase _database;

    public SalesmanService(AccountingDatabase database)
    {
        _database = database;
    }

    public async Task<Salesman> CreateAsync(SalesmanCreateRequest request)
    {
        // Validate if instance exists
        // Validate if requester can access the instance
        // Validate properties

        var salesman = (await _database.Salesmen.AddAsync(
            new Salesman
            {
                InstanceId = request.InstanceId,
                Name = request.Salesman.Name,
                VatPayerCode = request.Salesman.VatPayerCode.Value,
                VatPayerCodeIssuedBy = request.Salesman.VatPayerCode.IssuedBy
            }
        )).Entity;

        await _database.SaveChangesAsync();

        return salesman;
    }

    public async Task DeleteAsync(SalesmanDeleteRequest request)
    {
        // Validate if instance exists
        // Validate if requester can access the instance
        // Validate if salesman exists

        var salesman = await _database.Salesmen.FirstAsync(it => it.Id == request.SalesmanId);

        salesman.IsDeleted = true;

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(SalesmanEditRequest request)
    {
        // Validate if instance exists
        // Validate if requester can access the instance
        // Validate if salesman exists
        // Validate properties

        var salesman = await _database.Salesmen.FirstAsync(it => it.Id == request.Salesman.Id);

        salesman.Name = request.Salesman.Name;
        salesman.VatPayerCode = request.Salesman.VatPayerCode.Value;
        salesman.VatPayerCodeIssuedBy = request.Salesman.VatPayerCode.IssuedBy;

        await _database.SaveChangesAsync();
    }

    public async Task<IEnumerable<Salesman>> GetAsync(SalesmanGetRequest request)
    {
        // Validate if instance exists
        // Validate if requester can access the instance

        if (request.InstanceId is not null)
        {
            return await _database.Salesmen
                .Where(it => !it.IsDeleted && it.InstanceId == request.InstanceId)
                .ToListAsync();
        }

        var instanceIds = await _database.InstanceUserMetas
            .Where(it => it.UserId == request.RequesterId)
            .Select(it => it.InstanceId)
            .ToHashSetAsync();

        return await _database.Salesmen
            .Where(
                it => !it.IsDeleted &&
                      it.InstanceId != null &&
                      instanceIds.Contains(it.InstanceId!.Value)
            )
            .ToListAsync();
    }

    public async Task<Salesman> GetByIdAsync(int id)
    {
        return await _database.Salesmen.FirstOrDefaultAsync(it => it.Id == id && !it.IsDeleted)
               ?? throw new ValidationException("Salesman not found");
    }
}