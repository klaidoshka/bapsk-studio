using Accounting.Contract;
using Accounting.Contract.Entity;
using Accounting.Contract.Request;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class InstanceUserMetaService : IInstanceUserMetaService
{
    private readonly AccountingDatabase _database;
    private readonly IInstanceUserMetaValidator _instanceUserMetaValidator;

    public InstanceUserMetaService(
        AccountingDatabase database,
        IInstanceUserMetaValidator instanceUserMetaValidator
    )
    {
        _database = database;
        _instanceUserMetaValidator = instanceUserMetaValidator;
    }

    public async Task<InstanceUserMeta> CreateAsync(InstanceUserMetaCreateRequest request)
    {
        (await _instanceUserMetaValidator.ValidateInstanceUserMetaCreateRequestAsync(request))
            .AssertValid();

        var instance = await _database.Instances
            .Include(i => i.UserMetas)
            .FirstAsync(i => i.Id == request.InstanceId);

        var userMeta = (await _database.InstanceUserMetas.AddAsync(
            new InstanceUserMeta
            {
                Instance = instance,
                UserId = request.UserId
            }
        )).Entity;

        await _database.SaveChangesAsync();

        return userMeta;
    }

    public async Task DeleteAsync(InstanceUserMetaDeleteRequest request)
    {
        (await _instanceUserMetaValidator.ValidateInstanceUserMetaDeleteRequestAsync(request))
            .AssertValid();

        var instanceUserMeta = await _database.InstanceUserMetas
            .Include(ium => ium.Instance)
            .FirstAsync(ium => ium.Id == request.InstanceUserMetaId);

        _database.InstanceUserMetas.Remove(instanceUserMeta);

        await _database.SaveChangesAsync();
    }

    public async Task<InstanceUserMeta> GetAsync(InstanceUserMetaGetRequest request)
    {
        (await _instanceUserMetaValidator.ValidateInstanceUserMetaGetRequestAsync(request))
            .AssertValid();

        return (await _database.InstanceUserMetas.FindAsync(request.InstanceUserMetaId))!;
    }

    public async Task<IEnumerable<InstanceUserMeta>> GetByInstanceIdAsync(
        InstanceUserMetaGetByInstanceRequest request
    )
    {
        (await _instanceUserMetaValidator
            .ValidateInstanceUserMetaGetByInstanceRequestAsync(request)).AssertValid();

        return await _database.InstanceUserMetas
            .Where(ium => ium.InstanceId == request.InstanceId)
            .ToListAsync();
    }
}