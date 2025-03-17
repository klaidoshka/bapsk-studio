using Microsoft.AspNetCore.Authorization;
using static Accounting.API.AuthorizationHandler.Requirement.UserRequirement;

namespace Accounting.API.AuthorizationHandler.Requirement;

public class UserRequirement(CrudOperation operation) : IAuthorizationRequirement
{
    public CrudOperation Operation { get; } = operation;

    public enum CrudOperation
    {
        Delete,
        Edit,
        GetById
    }
}