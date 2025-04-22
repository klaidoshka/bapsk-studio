using Accounting.API.Filter;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;

namespace Accounting.API.Util;

public static class EndpointFilterExtensions
{
    public static RouteHandlerBuilder RequireInstanceOwnsEntity<T>(
        this RouteHandlerBuilder builder,
        string entityIdArgumentName = "id",
        bool entityIdOptional = false
    ) where T : class
    {
        return builder.AddEndpointFilterFactory((_, next) =>
            {
                return async invocationContext =>
                {
                    var services = invocationContext.HttpContext.RequestServices;
                    var validator = services.GetRequiredService<IInstanceEntityValidator<T>>();
                    var filter = new InstanceOwnsEntityFilter<T>(entityIdArgumentName, entityIdOptional, validator);

                    return await filter.InvokeAsync(invocationContext, next);
                };
            }
        );
    }

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