using Microsoft.AspNetCore.Authorization;

namespace Accounting.API.AuthorizationHandler.Requirement;

public class UserRequirement(UserRequirement.CrudOperation operation) : IAuthorizationRequirement
{
    public CrudOperation Operation { get; } = operation;

    public enum CrudOperation
    {
        Delete,
        Edit,
        GetById
    }
}