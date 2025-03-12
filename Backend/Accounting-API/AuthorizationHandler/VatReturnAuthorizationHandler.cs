using Accounting.API.AuthorizationHandler.Requirement;
using Accounting.API.Util;
using Accounting.Contract.Dto;
using Microsoft.AspNetCore.Authorization;

namespace Accounting.API.AuthorizationHandler;

public class VatReturnAuthorizationHandler : AuthorizationHandler<VatReturnRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public VatReturnAuthorizationHandler(
        IHttpContextAccessor httpContextAccessor
    )
    {
        _httpContextAccessor = httpContextAccessor;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        VatReturnRequirement requirement
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
        //     case CustomerRequirement.CrudOperation.Get:
        //         var getInstanceId = httpContext.FindProperty<int>("instanceId");
        //         result = new Validation();
        //
        //         break;
        //
        //     case CustomerRequirement.CrudOperation.GetBySaleId:
        //         var getSaleId = httpContext.FindProperty<int>("saleId");
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