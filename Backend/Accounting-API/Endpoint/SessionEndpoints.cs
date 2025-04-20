using Accounting.API.Util;
using Accounting.Contract.Dto.Session;
using Accounting.Contract.Service;

namespace Accounting.API.Endpoint;

public static class SessionEndpoints
{
    public static void MapSessionEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapDelete("{id:guid}", Delete);
        builder.MapGet("{id:guid}", GetById);
        builder.MapGet(String.Empty, GetByUser);
    }

    private static async Task<IResult> Delete(
        Guid id,
        HttpContext httpContext,
        ISessionService sessionService
    )
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

    private static async Task<IResult> GetById(
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
    );

    private static async Task<IResult> GetByUser(
        HttpContext httpContext,
        ISessionService sessionService
    ) => Results.Json(
        (await sessionService.GetAsync(
            new SessionGetByUserRequest
            {
                RequesterId = httpContext.GetUserIdOrThrow()
            }
        ))
        .Select(s => s.ToDto())
        .ToList()
    );
}