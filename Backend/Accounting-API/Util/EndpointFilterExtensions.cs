using Accounting.API.Filter;
using Accounting.Contract.Service;

namespace Accounting.API.Util;

public static class EndpointFilterExtensions
{
    public static RouteHandlerBuilder RequireInstancePermission(this RouteHandlerBuilder builder, string permission) =>
        builder.AddEndpointFilterFactory((_, next) =>
            {
                return async invocationContext =>
                {
                    var services = invocationContext.HttpContext.RequestServices;
                    var instanceAuthorizationService = services.GetRequiredService<IInstanceAuthorizationService>();
                    var filter = new InstanceAuthorizationFilter(instanceAuthorizationService, permission);

                    return await filter.InvokeAsync(invocationContext, next);
                };
            }
        );
}