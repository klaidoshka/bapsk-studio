using Microsoft.AspNetCore.Authorization;
using static Accounting.API.AuthorizationHandler.Requirement.CustomerRequirement;

namespace Accounting.API.AuthorizationHandler.Requirement;

public class CustomerRequirement(CrudOperation operation) : IAuthorizationRequirement
{
    public CrudOperation Operation { get; } = operation;

    public enum CrudOperation
    {
        Create,
        Delete,
        Edit,
        Get,
        GetById
    }
}