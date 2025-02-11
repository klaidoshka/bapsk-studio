using Accounting.Contract;
using Accounting.Contract.Entity;
using Accounting.Contract.Response;
using Accounting.Contract.Service;
using Accounting.Contract.Service.Request;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class InstanceUserMetaService : IInstanceUserMetaService
{
    private readonly AccountingDatabase _database;

    public InstanceUserMetaService(AccountingDatabase database)
    {
        _database = database;
    }

    public async Task<InstanceUserMeta> CreateAsync(InstanceUserMetaCreateRequest request)
    {
        var instance = await _database.Instances
                           .Include(i => i.UserMetas)
                           .FirstOrDefaultAsync(i => i.Id == request.InstanceId)
                       ?? throw new ValidationException("Instance to add user to was not found.");

        if (instance.UserMetas.Any(um => um.UserId == request.UserId))
        {
            throw new ValidationException("User is already added to the instance.");
        }

        var user = await _database.Users.FindAsync(request.UserId)
                   ?? throw new ValidationException("User to add to instance was not found.");

        var userMeta = (await _database.InstanceUserMetas.AddAsync(
            new InstanceUserMeta
            {
                Instance = instance,
                User = user
            }
        )).Entity;

        await _database.SaveChangesAsync();

        return userMeta;
    }

    public async Task DeleteAsync(int id, int managerId)
    {
        var instanceUserMeta = await _database.InstanceUserMetas
                                   .Include(ium => ium.Instance)
                                   .FirstOrDefaultAsync(ium => ium.Id == id)
                               ?? throw new ValidationException("Instance user meta not found.");

        if (instanceUserMeta.UserId == managerId)
        {
            throw new ValidationException("Creator cannot be removed from the instance, instead delete instance.");
        }

        _database.InstanceUserMetas.Remove(instanceUserMeta);

        await _database.SaveChangesAsync();
    }

    public async Task<InstanceUserMeta> GetAsync(int id)
    {
        return await _database.InstanceUserMetas.FindAsync(id)
               ?? throw new ValidationException("Instance user meta not found.");
    }

    public async Task<IEnumerable<InstanceUserMeta>> GetByInstanceIdAsync(int instanceId)
    {
        return await _database.InstanceUserMetas
            .Where(ium => ium.InstanceId == instanceId)
            .ToListAsync();
    }
}