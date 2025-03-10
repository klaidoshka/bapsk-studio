using Accounting.API.Util;
using Accounting.Contract.Service;

namespace Accounting.API.Middleware;

public class UserIdExtractorMiddleware : IMiddleware
{
    public static string UserIdKey => "UserId";
    
    private readonly IServiceScopeFactory _scopeFactory;

    public UserIdExtractorMiddleware(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var accessToken = context.Request.ToAccessToken();
        var scope = _scopeFactory.CreateScope();
        var jwtService = scope.ServiceProvider.GetRequiredService<IJwtService>();

        if (String.IsNullOrEmpty(accessToken) || !jwtService.IsTokenValid(accessToken))
        {
            await next(context);

            return;
        }

        var session = await jwtService.ExtractSessionAsync(accessToken);

        if (session != null)
        {
            context.Items[UserIdKey] = session.UserId;
        }

        await next(context);
    }
}