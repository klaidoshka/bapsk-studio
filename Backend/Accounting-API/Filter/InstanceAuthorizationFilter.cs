using System.Security.Claims;
using Accounting.API.Util;
using Accounting.Contract.Service;

namespace Accounting.API.Filter;

public class InstanceAuthorizationFilter : IEndpointFilter
{
    private readonly IInstanceAuthorizationService _instanceAuthorizationService;
    private readonly string _permission;

    public InstanceAuthorizationFilter(IInstanceAuthorizationService instanceAuthorizationService, string permission)
    {
        _instanceAuthorizationService = instanceAuthorizationService;
        _permission = permission;
    }

    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var instanceIdAsString = (await context.HttpContext.FindValueAsync("instanceId"))?.ToString();

        if (!Int32.TryParse(instanceIdAsString, out var instanceId))
        {
            return Results.BadRequest("Invalid or missing instance id.");
        }

        var user = context.HttpContext.User;

        if (!user.Identity?.IsAuthenticated ?? true)
        {
            return Results.Unauthorized();
        }

        var userIdAsString = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Int32.TryParse(userIdAsString, out var userId))
        {
            return Results.Unauthorized();
        }

        if (!await _instanceAuthorizationService.IsAuthorizedAsync(instanceId, userId, _permission))
        {
            return Results.Forbid();
        }

        return await next(context);
    }
}