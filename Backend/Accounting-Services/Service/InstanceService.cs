using Accounting.Contract;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Accounting.Contract.Service.Request;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class InstanceService : IInstanceService
{
    private readonly AccountingDatabase _database;

    public InstanceService(AccountingDatabase database)
    {
        _database = database;
    }

    public async Task<Instance> CreateAsync(InstanceCreateRequest request)
    {
        var creator = await _database.Users.FindAsync(request.CreatorId)
                      ?? throw new ArgumentException("Creator was not found.");

        var instance = new Instance
        {
            CreatedAt = DateTime.UtcNow,
            CreatedBy = creator,
            Description = request.Description,
            Name = request.Name
        };

        instance.UserMetas.Add(new InstanceUserMeta { User = creator });

        instance = (await _database.Instances.AddAsync(instance)).Entity;

        await _database.SaveChangesAsync();

        return instance;
    }

    public async Task DeleteAsync(int instanceId)
    {
        var instance = await _database.Instances.FindAsync(instanceId)
                       ?? throw new ArgumentException("Instance to delete was not found.");

        _database.Instances.Remove(instance);

        await _database.SaveChangesAsync();
    }

    public Task EditAsync(InstanceEditRequest request)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<Instance>> GetAsync()
    {
        return await _database.Instances.ToListAsync();
    }

    public async Task<Instance> GetAsync(int instanceId)
    {
        return await _database.Instances.FindAsync(instanceId)
               ?? throw new ArgumentException("Instance not found.");
    }

    public async Task<IEnumerable<Instance>> GetByUserIdAsync(int userId)
    {
        return await _database.Instances
            .Include(i => i.UserMetas)
            .Where(i => i.UserMetas.Any(um => um.UserId == userId))
            .ToListAsync();
    }
}