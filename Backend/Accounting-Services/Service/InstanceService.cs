using Accounting.Contract;
using Accounting.Contract.Dto.Instance;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;
using Instance = Accounting.Contract.Entity.Instance;
using InstanceUserMeta = Accounting.Contract.Entity.InstanceUserMeta;

namespace Accounting.Services.Service;

public class InstanceService : IInstanceService
{
    private readonly AccountingDatabase _database;
    private readonly IInstanceValidator _instanceValidator;

    public InstanceService(
        AccountingDatabase database,
        IInstanceValidator instanceValidator
    )
    {
        _database = database;
        _instanceValidator = instanceValidator;
    }

    public async Task<Instance> CreateAsync(InstanceCreateRequest request)
    {
        (await _instanceValidator.ValidateInstanceCreateRequestAsync(request)).AssertValid();

        var user = (await _database.Users.FindAsync(request.RequesterId))!;

        var instance = new Instance
        {
            CreatedAt = DateTime.UtcNow,
            CreatedBy = user,
            Description = request.Description,
            Name = request.Name,
            UserMetas = new List<InstanceUserMeta>()
        };

        instance.UserMetas.Add(new InstanceUserMeta { User = user });

        instance = (await _database.Instances.AddAsync(instance)).Entity;

        await _database.SaveChangesAsync();

        return instance;
    }

    public async Task DeleteAsync(InstanceDeleteRequest request)
    {
        (await _instanceValidator.ValidateInstanceDeleteRequestAsync(request)).AssertValid();

        var instance = (await _database.Instances.FindAsync(request.InstanceId))!;

        _database.Instances.Remove(instance);

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(InstanceEditRequest request)
    {
        (await _instanceValidator.ValidateInstanceEditRequestAsync(request)).AssertValid();

        var instance = (await _database.Instances.FindAsync(request.InstanceId))!;

        instance.Description = request.Description;
        instance.Name = request.Name;

        await _database.SaveChangesAsync();
    }

    public async Task<Instance> GetAsync(InstanceGetRequest request)
    {
        (await _instanceValidator.ValidateInstanceGetRequestAsync(request)).AssertValid();

        return (await _database.Instances.FindAsync(request.InstanceId))!;
    }

    public async Task<IEnumerable<Instance>> GetByUserIdAsync(InstanceGetByUserRequest request)
    {
        return await _database.Instances
            .Include(i => i.UserMetas)
            .ThenInclude(um => um.User)
            .Where(
                i => i.UserMetas.Any(um => um.UserId == request.RequesterId && !um.User.IsDeleted)
            )
            .ToListAsync();
    }
}