using Accounting.API.AuthorizationHandler.Requirement;
using Accounting.API.Util;
using Accounting.Contract.Dto;
using Microsoft.AspNetCore.Authorization;

namespace Accounting.API.AuthorizationHandler;

public class CustomerAuthorizationHandler : AuthorizationHandler<CustomerRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CustomerAuthorizationHandler(
        IHttpContextAccessor httpContextAccessor
    )
    {
        _httpContextAccessor = httpContextAccessor;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        CustomerRequirement requirement
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
        //     case CustomerRequirement.CrudOperation.Create:
        //         var createRequest = await httpContext.Request.ReadFromJsonAsync<CustomerCreateRequest>();
        //         result = new Validation();
        //
        //         break;
        //
        //     case CustomerRequirement.CrudOperation.Delete:
        //         var deleteId = httpContext.FindProperty<int>("id");
        //         result = new Validation();
        //
        //         break;
        //
        //     case CustomerRequirement.CrudOperation.Edit:
        //         var editId = httpContext.FindProperty<int>("id");
        //         result = new Validation();
        //
        //         break;
        //
        //     case CustomerRequirement.CrudOperation.Get:
        //         var getInstanceId = httpContext.FindProperty<int>("instanceId");
        //         result = new Validation();
        //
        //         break;
        //
        //     case CustomerRequirement.CrudOperation.GetById:
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