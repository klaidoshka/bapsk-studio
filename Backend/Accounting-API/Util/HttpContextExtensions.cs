using Accounting.API.Configuration;

namespace Accounting.API.Util;

public static class HttpContextExtensions
{
    public static int GetInstanceId(this HttpContext httpContext)
    {
        return httpContext.GetInstanceIdOrNull() ?? throw new BadHttpRequestException("Missing instance id.");
    }

    public static int? GetInstanceIdOrNull(this HttpContext httpContext)
    {
        return httpContext.Items.TryGetValue(HttpContextItem.InstanceId, out var instanceId)
            ? (int?)instanceId
            : null;
    }

    public static int GetUserId(this HttpContext httpContext)
    {
        return httpContext.GetUserIdOrNull() ?? throw new UnauthorizedAccessException();
    }

    public static int? GetUserIdOrNull(this HttpContext httpContext)
    {
        return httpContext.Items.TryGetValue(HttpContextItem.UserId, out var userId)
            ? (int?)userId
            : null;
    }
}