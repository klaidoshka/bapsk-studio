using Accounting.Contract;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Instance;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Validator;

public class InstanceValidator : IInstanceValidator
{
    private readonly AccountingDatabase _database;

    public InstanceValidator(AccountingDatabase database)
    {
        _database = database;
    }

    public async Task<Validation> ValidateCreateRequestAsync(InstanceCreateRequest request)
    {
        var user = await _database.Users
            .Include(u => u.InstancesCreated)
            .FirstOrDefaultAsync(u => u.Id == request.RequesterId && !u.IsDeleted);

        if (user == null)
        {
            return new Validation("Instance creator was not found.");
        }

        if (String.IsNullOrWhiteSpace(request.Name))
        {
            return new Validation("Instance must have a name.");
        }

        if (
            user.InstancesCreated.Any(ic => !ic.IsDeleted && ic.Name.Equals(
                    request.Name,
                    StringComparison.OrdinalIgnoreCase
                )
            )
        )
        {
            return new Validation("You already have created an instance with this name.");
        }

        var userIds = request.Users
            .Select(it => it.UserId)
            .ToHashSet();

        return await _database.Users.CountAsync(u => userIds.Contains(u.Id)) != userIds.Count
            ? new Validation("One or more users were not found.")
            : new Validation();
    }

    public async Task<Validation> ValidateDeleteRequestAsync(InstanceDeleteRequest request)
    {
        var instance = await _database.Instances.FindAsync(request.InstanceId);

        if (instance == null || instance.IsDeleted)
        {
            return new Validation("Instance was not found.");
        }

        return instance.CreatedById != request.RequesterId
            ? new Validation("You cannot delete an instance you did not create.")
            : new Validation();
    }

    public async Task<Validation> ValidateEditRequestAsync(InstanceEditRequest request)
    {
        var instance = await _database.Instances
            .Include(i => i.CreatedBy)
            .ThenInclude(u => u.InstancesCreated)
            .FirstAsync(i => i.Id == request.InstanceId);

        if (String.IsNullOrWhiteSpace(request.Name))
        {
            return new Validation("Instance must have a name.");
        }

        if (
            instance.CreatedBy.InstancesCreated.Any(ic => !ic.IsDeleted && ic.Name.Equals(
                    request.Name,
                    StringComparison.OrdinalIgnoreCase
                ) && ic.Id != request.InstanceId
            )
        )
        {
            return new Validation("You already have created an instance with this name.");
        }

        var users = request.Users
            .Select(it => it.UserId)
            .ToHashSet()
            .Select(async id => await _database.Users.FindAsync(id))
            .Select(t => t.Result)
            .ToList();

        return users.Any(it => it == null)
            ? new Validation("One or more users were not found.")
            : new Validation();
    }

    public async Task<Validation> ValidateExistsAsync(int instanceId)
    {
        return await _database.Instances.AnyAsync(it => it.Id == instanceId && !it.IsDeleted)
            ? new Validation()
            : new Validation("Instance was not found.");
    }

    public async Task<Validation> ValidateGetRequestAsync(InstanceGetRequest request)
    {
        var instance = await _database.Instances
            .Include(i => i.Users)
            .FirstOrDefaultAsync(i => i.Id == request.InstanceId);

        if (instance == null || instance.IsDeleted)
        {
            return new Validation("Instance was not found.");
        }

        return instance.Users.All(um => um.UserId != request.RequesterId)
            ? new Validation("You do not have access to this instance.")
            : new Validation();
    }
}