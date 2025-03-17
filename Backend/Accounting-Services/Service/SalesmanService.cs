using Accounting.Contract;
using Accounting.Contract.Dto.Salesman;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;
using Salesman = Accounting.Contract.Entity.Salesman;

namespace Accounting.Services.Service;

public class SalesmanService : ISalesmanService
{
    private readonly AccountingDatabase _database;
    private readonly ISalesmanValidator _salesmanValidator;

    public SalesmanService(AccountingDatabase database, ISalesmanValidator salesmanValidator)
    {
        _database = database;
        _salesmanValidator = salesmanValidator;
    }

    public async Task<Salesman> CreateAsync(SalesmanCreateRequest request)
    {
        // Validate if instance exists (HIGHER LEVEL)
        // Validate if requester can access the instance (HIGHER LEVEL)
        // Validate properties
        (await _salesmanValidator.ValidateSalesmanAsync(request.Salesman)).AssertValid();

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
        // Validate if instance exists (HIGHER LEVEL)
        // Validate if requester can access the instance (HIGHER LEVEL)
        // Validate if salesman exists
        (await _salesmanValidator.ValidateDeleteRequestAsync(request.SalesmanId)).AssertValid();

        var salesman = await _database.Salesmen.FirstAsync(it => it.Id == request.SalesmanId);

        salesman.IsDeleted = true;

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(SalesmanEditRequest request)
    {
        // Validate if instance exists (HIGHER LEVEL)
        // Validate if requester can access the instance (HIGHER LEVEL)
        // Validate if salesman exists
        // Validate properties
        (await _salesmanValidator.ValidateEditRequestAsync(request.Salesman)).AssertValid();

        var salesman = await _database.Salesmen.FirstAsync(it => it.Id == request.Salesman.Id);

        salesman.Name = request.Salesman.Name;
        salesman.VatPayerCode = request.Salesman.VatPayerCode.Value;
        salesman.VatPayerCodeIssuedBy = request.Salesman.VatPayerCode.IssuedBy;

        await _database.SaveChangesAsync();
    }

    public async Task<IEnumerable<Salesman>> GetAsync(SalesmanGetRequest request)
    {
        // Validate if instance exists (HIGHER LEVEL)
        // Validate if requester can access the instance (HIGHER LEVEL)
        (await _salesmanValidator.ValidateGetRequestAsync(request.InstanceId)).AssertValid();

        return await _database.Salesmen
            .Where(it => !it.IsDeleted && it.InstanceId == request.InstanceId)
            .ToListAsync();
    }

    public async Task<Salesman> GetByIdAsync(int id)
    {
        // Validate if salesman exists
        // Validate if requester can access the instance (HIGHER LEVEL)
        (await _salesmanValidator.ValidateGetByIdRequestAsync(id)).AssertValid();
        
        return await _database.Salesmen.FirstAsync(it => it.Id == id && !it.IsDeleted);
    }
}