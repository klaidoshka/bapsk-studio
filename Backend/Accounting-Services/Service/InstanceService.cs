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
        (await _instanceValidator.ValidateCreateRequestAsync(request)).AssertValid();

        var instance = new Instance
        {
            CreatedAt = DateTime.UtcNow,
            CreatedById = request.RequesterId,
            Description = request.Description,
            Name = request.Name
        };

        instance.UserMetas.Add(new InstanceUserMeta { UserId = request.RequesterId });

        var userIds = request.UserMetas
            .Where(it => it.UserId != request.RequesterId)
            .Select(it => it.UserId)
            .ToList();

        foreach (var userId in userIds)
        {
            instance.UserMetas.Add(new InstanceUserMeta { UserId = userId });
        }

        instance = (await _database.Instances.AddAsync(instance)).Entity;

        await _database.SaveChangesAsync();

        return instance;
    }

    public async Task DeleteAsync(InstanceDeleteRequest request)
    {
        (await _instanceValidator.ValidateDeleteRequestAsync(request)).AssertValid();

        var instance = await _database.Instances.FirstAsync(it => it.Id == request.InstanceId);

        instance.IsDeleted = true;

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(InstanceEditRequest request)
    {
        (await _instanceValidator.ValidateEditRequestAsync(request)).AssertValid();

        var instance = await _database.Instances
            .Include(it => it.UserMetas)
            .FirstAsync(it => it.Id == request.InstanceId);

        instance.Description = request.Description;
        instance.Name = request.Name;

        var existingUserIds = instance.UserMetas
            .Select(it => it.UserId)
            .ToHashSet();

        var providedUserIds = request.UserMetas
            .Select(it => it.UserId)
            .ToHashSet();

        var missingUserIds = existingUserIds
            .Except(providedUserIds)
            .Where(it => it != instance.CreatedById)
            .ToList();

        foreach (var missingUserId in missingUserIds)
        {
            instance.UserMetas
                .Where(it => it.UserId == missingUserId)
                .ToList()
                .ForEach(
                    it =>
                    {
                        _database.Remove(it);
                        instance.UserMetas.Remove(it);
                    }
                );
        }

        var newUserIds = providedUserIds
            .Except(existingUserIds)
            .ToList();

        foreach (var newUserId in newUserIds)
        {
            instance.UserMetas.Add(new InstanceUserMeta { UserId = newUserId });
        }

        await _database.SaveChangesAsync();
    }

    public async Task<Instance> GetAsync(InstanceGetRequest request)
    {
        (await _instanceValidator.ValidateGetRequestAsync(request)).AssertValid();

        return await _database.Instances
            .Include(i => i.UserMetas)
            .FirstAsync(it => it.Id == request.InstanceId && !it.IsDeleted);
    }

    public async Task<IList<Instance>> GetAsync(InstanceGetByUserRequest request)
    {
        return await _database.Instances
            .Include(i => i.UserMetas)
            .ThenInclude(um => um.User)
            .Where(
                i => i.UserMetas.Any(
                         um => um.UserId == request.RequesterId && !um.User.IsDeleted
                     ) &&
                     !i.IsDeleted
            )
            .ToListAsync();
    }
}