using Accounting.API.Util;
using Accounting.Contract.Dto.Session;
using Accounting.Contract.Service;

namespace Accounting.API.Endpoint;

public static class SessionEndpoints
{
    public static void MapSessionEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapDelete(
            "{id:guid}",
            async (
                Guid id,
                HttpContext httpContext,
                ISessionService sessionService
            ) =>
            {
                await sessionService.DeleteAsync(
                    new SessionDeleteRequest
                    {
                        RequesterId = httpContext.GetUserIdOrThrow(),
                        SessionId = id
                    }
                );

                return Results.Ok();
            }
        );

        builder.MapGet(
            "{id:guid}",
            async (
                Guid id,
                HttpContext httpContext,
                ISessionService sessionService
            ) => Results.Json(
                (await sessionService.GetAsync(
                    new SessionGetRequest
                    {
                        RequesterId = httpContext.GetUserIdOrThrow(),
                        SessionId = id
                    }
                )).ToDto()
            )
        );

        builder.MapGet(
            String.Empty,
            async (
                HttpContext httpContext,
                ISessionService sessionService
            ) => Results.Json(
                (await sessionService.GetByUserIdAsync(
                    new SessionGetByUserRequest
                    {
                        RequesterId = httpContext.GetUserIdOrThrow()
                    }
                ))
                .Select(s => s.ToDto())
                .ToList()
            )
        );
    }
}