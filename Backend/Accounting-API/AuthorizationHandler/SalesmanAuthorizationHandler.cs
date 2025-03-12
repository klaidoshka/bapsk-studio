using Accounting.API.AuthorizationHandler.Requirement;
using Accounting.API.Util;
using Accounting.Contract.Dto;
using Microsoft.AspNetCore.Authorization;

namespace Accounting.API.AuthorizationHandler;

public class SalesmanAuthorizationHandler : AuthorizationHandler<SalesmanRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public SalesmanAuthorizationHandler(
        IHttpContextAccessor httpContextAccessor
    )
    {
        _httpContextAccessor = httpContextAccessor;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        SalesmanRequirement requirement
    )
    {
        var httpContext = _httpContextAccessor.HttpContext;
        var requesterId = httpContext?.GetUserId();

        if (httpContext is null || !requesterId.HasValue)
        {
            context.Fail();

            return;
        }

        // TODO: Add validation logic
        Validation result = new();

        // switch (requirement.Operation)
        // {
        //     case SalesmanRequirement.CrudOperation.Create:
        //         var createRequest = await httpContext.Request.ReadFromJsonAsync<SalesmanCreateRequest>();
        //         result = new Validation();
        //
        //         break;
        //
        //     case SalesmanRequirement.CrudOperation.Delete:
        //         var deleteId = httpContext.FindProperty<int>("id");
        //         result = new Validation();
        //
        //         break;
        //
        //     case SalesmanRequirement.CrudOperation.Edit:
        //         var editId = httpContext.FindProperty<int>("id");
        //         result = new Validation();
        //
        //         break;
        //
        //     case SalesmanRequirement.CrudOperation.Get:
        //         var getInstanceId = httpContext.FindProperty<int>("instanceId");
        //         result = new Validation();
        //
        //         break;
        //
        //     case SalesmanRequirement.CrudOperation.GetById:
        //         var getId = httpContext.FindProperty<int>("id");
        //         result = new Validation();
        //
        //         break;
        //
        //     default:
        //         throw new ArgumentOutOfRangeException();
        // }

        if (result.IsValid)
        {
            context.Succeed(requirement);
        }
        else
        {
            context.Fail(new AuthorizationFailureReason(this, result.FailureMessages.First()));
        }
    }
}