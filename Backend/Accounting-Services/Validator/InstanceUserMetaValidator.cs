using Accounting.Contract;
using Accounting.Contract.Request;
using Accounting.Contract.Response;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Validator;

public class InstanceUserMetaValidator : IInstanceUserMetaValidator
{
    private readonly AccountingDatabase _database;

    public InstanceUserMetaValidator(AccountingDatabase database)
    {
        _database = database;
    }

    public async Task<Validation> ValidateInstanceUserMetaCreateRequestAsync(
        InstanceUserMetaCreateRequest request
    )
    {
        var instance = await _database.Instances
            .Include(i => i.UserMetas)
            .FirstOrDefaultAsync(i => i.Id == request.InstanceId);

        if (instance == null)
        {
            return new Validation("Instance to add user to was not found.");
        }

        if (instance.CreatedById != request.RequesterId)
        {
            return new Validation("You are not allowed to add users to this instance.");
        }

        if (instance.UserMetas.Any(um => um.UserId == request.UserId))
        {
            return new Validation("User is already added to the instance.");
        }

        return await _database.Users.FindAsync(request.UserId) == null
            ? new Validation("User to add to instance was not found.")
            : new Validation();
    }

    public async Task<Validation> ValidateInstanceUserMetaDeleteRequestAsync(
        InstanceUserMetaDeleteRequest request
    )
    {
        var instanceUserMeta = await _database.InstanceUserMetas
            .Include(ium => ium.Instance)
            .FirstOrDefaultAsync(ium => ium.Id == request.InstanceUserMetaId);

        if (instanceUserMeta == null)
        {
            return new Validation("Instance user meta not found.");
        }

        if (instanceUserMeta.Instance.CreatedById != request.RequesterId)
        {
            return new Validation("You are not allowed to remove users from this instance.");
        }

        return instanceUserMeta.UserId == request.RequesterId
            // This works, because above we check whether requester is the creator of the instance
            ? new Validation(
                "Creator cannot be removed from the instance, instead delete instance."
            )
            : new Validation();
    }

    public async Task<Validation> ValidateInstanceUserMetaGetRequestAsync(
        InstanceUserMetaGetRequest request
    )
    {
        var instanceUserMeta = await _database.InstanceUserMetas
            .Include(ium => ium.Instance)
            .FirstOrDefaultAsync(ium => ium.Id == request.InstanceUserMetaId);

        if (instanceUserMeta == null)
        {
            return new Validation("Instance user meta not found.");
        }

        return instanceUserMeta.Instance.CreatedById != request.RequesterId
            ? new Validation("You are not allowed to view this instance user meta.")
            : new Validation();
    }

    public async Task<Validation> ValidateInstanceUserMetaGetByInstanceRequestAsync(
        InstanceUserMetaGetByInstanceRequest request
    )
    {
        var instance = await _database.Instances.FindAsync(request.InstanceId);

        if (instance == null)
        {
            return new Validation("Instance not found.");
        }

        return instance.CreatedById != request.RequesterId
            ? new Validation("You are not allowed to view this instance user metas.")
            : new Validation();
    }
}