using Accounting.API.Configuration;
using Accounting.Contract.Configuration;
using Accounting.Contract.Entity;

namespace Accounting.API.Middleware;

public class JwtExtractorMiddleware : IMiddleware
{
    private readonly ILogger<JwtExtractorMiddleware> _logger;

    public JwtExtractorMiddleware(ILogger<JwtExtractorMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var userIdAsString = context.User.FindFirst(Claims.UserId)?.Value;

        if (userIdAsString is not null)
        {
            context.Items[HttpContextItem.Role] = Enum.Parse<Role>(context.User.FindFirst(Claims.Role)!.Value);
            context.Items[HttpContextItem.SessionId] = Guid.Parse(context.User.FindFirst(Claims.SessionId)!.Value);
            context.Items[HttpContextItem.UserId] = Int32.Parse(userIdAsString);

            _logger.LogDebug(
                "User (#{UserId} ID - {Role}) accessing API. Session: {SessionId}",
                context.Items[HttpContextItem.UserId],
                context.Items[HttpContextItem.Role],
                context.Items[HttpContextItem.SessionId]
            );
        }
        else
        {
            _logger.LogDebug(
                "Unknown user accessing API: {RemoteIp}",
                context.Connection.RemoteIpAddress
            );
        }

        await next(context);
    }
}