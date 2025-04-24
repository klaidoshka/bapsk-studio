using Accounting.Contract;
using Accounting.Contract.Service;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class InstanceAuthorizationService : IInstanceAuthorizationService
{
    private readonly AccountingDatabase _database;

    public InstanceAuthorizationService(AccountingDatabase database)
    {
        _database = database;
    }

    public async Task<bool> IsAuthorizedAsync(int instanceId, int userId, string permission)
    {
        return await _database.Instances.AnyAsync(i =>
            !i.IsDeleted &&
            i.Id == instanceId &&
            (
                i.CreatedById == userId ||
                i.Users.Any(um => um.UserId == userId && um.Permissions
                    .Select(up => up.Permission)
                    .Contains(permission)
                )
            )
        );
    }

    public async Task<bool> IsCreatorAsync(int instanceId, int userId)
    {
        return await _database.Instances.AnyAsync(i => !i.IsDeleted && i.Id == instanceId && i.CreatedById == userId);
    }

    public async Task<bool> IsMemberAsync(int instanceId, int userId)
    {
        return await _database.InstanceUsers.AnyAsync(ium =>
            !ium.Instance.IsDeleted && ium.InstanceId == instanceId && ium.UserId == userId
        );
    }
}