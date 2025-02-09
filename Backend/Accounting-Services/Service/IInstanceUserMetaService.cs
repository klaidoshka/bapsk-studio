using Accounting.Contract;
using Accounting.Contract.Entity;
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
                       ?? throw new ArgumentException("Instance to add user to was not found.");

        if (instance.CreatedById != request.ManagerId)
        {
            throw new ArgumentException("Manager does not have permission to add users to this instance.");
        }

        if (instance.UserMetas.Any(um => um.UserId == request.UserId))
        {
            throw new ArgumentException("User is already added to the instance.");
        }

        var user = await _database.Users.FindAsync(request.UserId)
                   ?? throw new ArgumentException("User to add to instance was not found.");

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

    public async Task DeleteAsync(InstanceUserMetaDeleteRequest request)
    {
        var instance = await _database.Instances
                           .Include(i => i.UserMetas)
                           .ThenInclude(um => um.User)
                           .FirstOrDefaultAsync(i => i.Id == request.InstanceId)
                       ?? throw new ArgumentException("Instance to remove user from was not found.");

        if (instance.CreatedById != request.ManagerId)
        {
            throw new ArgumentException("Manager is not the creator of the instance. Only the creator can remove users.");
        }

        if (request.UserId == request.ManagerId)
        {
            throw new ArgumentException("Creator cannot be removed from the instance. Delete the instance instead.");
        }

        var userMeta = instance.UserMetas.FirstOrDefault(um => um.UserId == request.UserId)
                       ?? throw new ArgumentException("User is not added to the instance.");

        _database.InstanceUserMetas.Remove(userMeta);

        await _database.SaveChangesAsync();
    }

    public async Task<InstanceUserMeta> GetAsync(int id)
    {
        return await _database.InstanceUserMetas.FindAsync(id)
               ?? throw new ArgumentException("Instance user meta not found.");
    }

    public async Task<IEnumerable<InstanceUserMeta>> GetByInstanceIdAsync(int instanceId)
    {
        return await _database.InstanceUserMetas
            .Where(ium => ium.InstanceId == instanceId)
            .ToListAsync();
    }
}