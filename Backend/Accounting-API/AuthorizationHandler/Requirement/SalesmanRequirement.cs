using Microsoft.AspNetCore.Authorization;
using static Accounting.API.AuthorizationHandler.Requirement.SalesmanRequirement;

namespace Accounting.API.AuthorizationHandler.Requirement;

public class SalesmanRequirement(CrudOperation operation) : IAuthorizationRequirement
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