using Accounting.Contract.Dto;
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
                ISessionService sessionService
            ) => Results.Json((await sessionService.GetAsync(id)).ToDto())
        );

        builder.MapGet(
            string.Empty,
            async (
                int userId,
                ISessionService sessionService
            ) => Results.Json(
                (await sessionService.GetByUserIdAsync(userId))
                .Select(s => s.ToDto())
                .ToList()
            )
        );
    }
}