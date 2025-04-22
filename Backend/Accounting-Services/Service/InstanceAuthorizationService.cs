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

    public Task<bool> IsAuthorizedAsync(int instanceId, int userId, string permission)
    {
        // TODO: Check if the user has the required permission. Creator has all permissions.
        return IsMemberAsync(instanceId, userId);
    }

    public async Task<bool> IsCreatorAsync(int instanceId, int userId)
    {
        return await _database.Instances.AnyAsync(i => !i.IsDeleted && i.Id == instanceId && i.CreatedById == userId);
    }

    public async Task<bool> IsMemberAsync(int instanceId, int userId)
    {
        return await _database.InstanceUserMetas
            .Include(ium => ium.Instance)
            .AnyAsync(ium => !ium.Instance.IsDeleted && ium.InstanceId == instanceId && ium.UserId == userId);
    }
}