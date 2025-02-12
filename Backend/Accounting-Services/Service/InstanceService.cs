using Accounting.Contract;
using Accounting.Contract.Entity;
using Accounting.Contract.Request;
using Accounting.Contract.Response;
using Accounting.Contract.Service;
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
                      ?? throw new ValidationException("Creator was not found.");

        var instance = new Instance
        {
            CreatedAt = DateTime.UtcNow,
            CreatedBy = creator,
            Description = request.Description,
            Name = request.Name,
            UserMetas = new List<InstanceUserMeta>()
        };

        instance.UserMetas.Add(new InstanceUserMeta { User = creator });

        instance = (await _database.Instances.AddAsync(instance)).Entity;

        await _database.SaveChangesAsync();

        return instance;
    }

    public async Task DeleteAsync(int instanceId)
    {
        var instance = await _database.Instances.FindAsync(instanceId)
                       ?? throw new ValidationException("Instance to delete was not found.");

        _database.Instances.Remove(instance);

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(InstanceEditRequest request)
    {
        var instance = await _database.Instances.FindAsync(request.Id)
                       ?? throw new ValidationException("Instance to edit was not found.");

        instance.Description = request.Description;
        instance.Name = request.Name;

        await _database.SaveChangesAsync();
    }

    public async Task<IEnumerable<Instance>> GetAsync()
    {
        return await _database.Instances.ToListAsync();
    }

    public async Task<Instance> GetAsync(int instanceId)
    {
        return await _database.Instances.FindAsync(instanceId)
               ?? throw new ValidationException("Instance not found.");
    }

    public async Task<IEnumerable<Instance>> GetByUserIdAsync(int userId)
    {
        return await _database.Instances
            .Include(i => i.UserMetas)
            .ThenInclude(um => um.User)
            .Where(i => i.UserMetas.Any(um => um.UserId == userId && !um.User.IsDeleted))
            .ToListAsync();
    }
}