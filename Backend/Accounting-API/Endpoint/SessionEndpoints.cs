using Accounting.API.Util;
using Accounting.Contract.Dto;
using Accounting.Contract.Request;
using Accounting.Contract.Service;

namespace Accounting.API.Endpoint;

public static class SessionEndpoints
{
    public static void MapSessionEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapGet(
            "{id:guid}",
            async (
                Guid id,
                HttpRequest httpRequest,
                IJwtService jwtService,
                ISessionService sessionService
            ) => Results.Json(
                (await sessionService.GetAsync(
                    new SessionGetRequest
                    {
                        RequesterId = await httpRequest.GetUserIdAsync(jwtService),
                        SessionId = id
                    }
                )).ToDto()
            )
        );

        builder.MapGet(
            string.Empty,
            async (
                HttpRequest httpRequest,
                IJwtService jwtService,
                ISessionService sessionService
            ) => Results.Json(
                (await sessionService.GetByUserIdAsync(
                    new SessionGetByUserRequest
                    {
                        RequesterId = await httpRequest.GetUserIdAsync(jwtService)
                    }
                ))
                .Select(s => s.ToDto())
                .ToList()
            )
        );
    }
}