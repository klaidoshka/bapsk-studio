using Accounting.Contract;
using Accounting.Contract.Dto.Instance;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;
using Instance = Accounting.Contract.Entity.Instance;
using InstanceUser = Accounting.Contract.Entity.InstanceUser;

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

        instance.Users.Add(new InstanceUser { UserId = request.RequesterId });

        var users = request.Users
            .Where(it => it.UserId != request.RequesterId)
            .ToList();

        foreach (var user in users)
        {
            instance.Users.Add(
                new InstanceUser
                {
                    Permissions = user.Permissions
                        .Select(p => new InstanceUserPermission
                            {
                                Permission = p
                            }
                        )
                        .ToList(),
                    UserId = user.UserId
                }
            );
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
            .Include(it => it.Users)
            .ThenInclude(it => it.Permissions)
            .FirstAsync(it => it.Id == request.InstanceId);

        instance.Description = request.Description;
        instance.Name = request.Name;

        var existingUsers = instance.Users.ToDictionary(it => it.UserId);
        var providedUsers = request.Users.ToDictionary(it => it.UserId);

        var removedUsers = existingUsers.Keys
            .Except(providedUsers.Keys)
            .Where(userId => userId != instance.CreatedById)
            .ToList();

        foreach (var missingUserId in removedUsers)
        {
            instance.Users
                .Where(it => it.UserId == missingUserId)
                .ToList()
                .ForEach(it => instance.Users.Remove(it));
        }

        var addedUsers = providedUsers
            .Where(user => !existingUsers.ContainsKey(user.Key))
            .ToList();

        foreach (var user in addedUsers)
        {
            instance.Users.Add(
                new InstanceUser
                {
                    Permissions = user.Value.Permissions
                        .Select(p => new InstanceUserPermission
                            {
                                Permission = p
                            }
                        )
                        .ToList(),
                    UserId = user.Key
                }
            );
        }

        var updatedUsers = providedUsers
            .Where(user => instance.CreatedById != user.Key && existingUsers.ContainsKey(user.Key))
            .ToList();

        foreach (var user in updatedUsers)
        {
            var existingUser = existingUsers[user.Key];

            existingUser.Permissions.Clear();

            foreach (var permission in user.Value.Permissions)
            {
                existingUser.Permissions.Add(
                    new InstanceUserPermission
                    {
                        Permission = permission
                    }
                );
            }
        }

        await _database.SaveChangesAsync();
    }

    public async Task<Instance> GetAsync(InstanceGetRequest request)
    {
        (await _instanceValidator.ValidateGetRequestAsync(request)).AssertValid();

        return await _database.Instances
            .Include(i => i.Users)
            .ThenInclude(u => u.Permissions)
            .FirstAsync(it => it.Id == request.InstanceId && !it.IsDeleted);
    }

    public async Task<IList<Instance>> GetAsync(InstanceGetByUserRequest request)
    {
        return await _database.Instances
            .Include(i => i.Users)
            .ThenInclude(u => u.Permissions)
            .Where(i =>
                !i.IsDeleted &&
                i.Users.Any(um =>
                    um.UserId == request.RequesterId &&
                    !um.User.IsDeleted
                )
            )
            .ToListAsync();
    }
}