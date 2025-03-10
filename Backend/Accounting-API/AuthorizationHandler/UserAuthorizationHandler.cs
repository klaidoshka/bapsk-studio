using Accounting.API.AuthorizationHandler.Requirement;
using Accounting.API.Util;
using Accounting.Contract.Response;
using Accounting.Contract.Validator;
using Microsoft.AspNetCore.Authorization;

namespace Accounting.API.AuthorizationHandler;

public class UserAuthorizationHandler : AuthorizationHandler<UserRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUserValidator _userValidator;

    public UserAuthorizationHandler(
        IHttpContextAccessor httpContextAccessor,
        IUserValidator userValidator
    )
    {
        _httpContextAccessor = httpContextAccessor;
        _userValidator = userValidator;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        UserRequirement requirement
    )
    {
        var httpContext = _httpContextAccessor.HttpContext;
        var requesterId = httpContext?.GetUserId();
        var requestedId = httpContext?.GetRequestedId();

        if (httpContext is null || !requesterId.HasValue || !requestedId.HasValue)
        {
            context.Fail();

            return;
        }

        Validation? result;

        switch (requirement.Operation)
        {
            case UserRequirement.CrudOperation.Delete:
                result = await _userValidator.ValidateUserDeleteAuthorizationAsync(requesterId.Value);

                break;

            case UserRequirement.CrudOperation.Edit:
                result = await _userValidator.ValidateUserEditAuthorizationAsync(
                    requesterId.Value,
                    requestedId.Value
                );

                break;

            case UserRequirement.CrudOperation.GetById:
                var onlyIdentityValue = httpContext.Request
                    .Query["returnIdentityOnly"]
                    .ToString()
                    .ToLowerInvariant();

                Boolean.TryParse(onlyIdentityValue, out var onlyIdentity);

                result = await _userValidator.ValidateUserGetByIdAuthorizationAsync(
                    requesterId.Value,
                    requestedId.Value,
                    onlyIdentity
                );

                break;

            default:
                throw new ArgumentOutOfRangeException();
        }

        if (result?.IsValid == true)
        {
            context.Succeed(requirement);
        }
        else
        {
            context.Fail();
        }
    }
}