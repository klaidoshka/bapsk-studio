using Accounting.Contract;
using Accounting.Contract.Request;
using Accounting.Contract.Response;
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

    public async Task<Validation> ValidateInstanceCreateRequestAsync(InstanceCreateRequest request)
    {
        var user = await _database.Users
            .Include(u => u.InstancesCreated)
            .FirstOrDefaultAsync(u => u.Id == request.RequesterId && !u.IsDeleted);

        if (user == null)
        {
            return new Validation("Instance creator was not found.");
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return new Validation("Instance must have a name.");
        }

        return user.InstancesCreated.Any(
            ic => ic.Name.Equals(
                request.Name,
                StringComparison.InvariantCultureIgnoreCase
            )
        )
            ? new Validation("You already have create an instance with this name.")
            : new Validation();
    }

    public async Task<Validation> ValidateInstanceDeleteRequestAsync(InstanceDeleteRequest request)
    {
        var instance = await _database.Instances.FindAsync(request.InstanceId);

        if (instance == null)
        {
            return new Validation("Instance was not found.");
        }

        return instance.CreatedById != request.RequesterId
            ? new Validation("You cannot delete an instance you did not create.")
            : new Validation();
    }

    public async Task<Validation> ValidateInstanceEditRequestAsync(InstanceEditRequest request)
    {
        var instance = await _database.Instances.FindAsync(request.InstanceId);

        if (instance == null)
        {
            return new Validation("Instance was not found.");
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return new Validation("Instance must have a name.");
        }

        return instance.CreatedById != request.RequesterId
            ? new Validation("You cannot edit an instance you did not create.")
            : new Validation();
    }

    public async Task<Validation> ValidateInstanceGetRequestAsync(InstanceGetRequest request)
    {
        var instance = await _database.Instances
            .Include(i => i.UserMetas)
            .FirstOrDefaultAsync(i => i.Id == request.InstanceId);

        if (instance == null)
        {
            return new Validation("Instance was not found.");
        }

        return instance.UserMetas.All(um => um.UserId != request.RequesterId)
            ? new Validation("You do not have access to this instance.")
            : new Validation();
    }
}