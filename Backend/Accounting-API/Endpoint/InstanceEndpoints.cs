using Accounting.API.Util;
using Accounting.Contract.Dto;
using Accounting.Contract.Request;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class InstanceEndpoints
{
    public static void MapInstanceEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            string.Empty,
            async (
                [FromBody] InstanceCreateRequest request,
                HttpRequest httpRequest,
                IJwtService jwtService,
                IInstanceService instanceService
            ) =>
            {
                var token = httpRequest.ToAccessToken()!;
                var session = jwtService.ExtractSession(token);

                if (session == null)
                {
                    throw new UnauthorizedAccessException("Invalid access token.");
                }

                request.CreatorId = session.UserId;

                return Results.Json((await instanceService.CreateAsync(request)).ToDto());
            }
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IInstanceService instanceService
            ) =>
            {
                await instanceService.DeleteAsync(id);

                return Results.Ok();
            }
        );

        builder.MapPut(
            "/{id:int}",
            async (
                int id,
                [FromBody] InstanceEditRequest request,
                IInstanceService instanceService
            ) =>
            {
                request.Id = id;

                await instanceService.EditAsync(request);

                return Results.Ok();
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IInstanceService instanceService
            ) => Results.Json((await instanceService.GetAsync(id)).ToDto())
        );

        builder.MapGet(
            string.Empty,
            async (
                int userId,
                IInstanceService instanceService
            ) => Results.Json(
                (await instanceService.GetByUserIdAsync(userId))
                .Select(i => i.ToDto())
                .ToList()
            )
        );
    }

    public static void MapInstanceMetaEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            string.Empty,
            async (
                [FromBody] InstanceUserMetaCreateRequest request,
                IInstanceUserMetaService instanceUserMetaService
            ) => Results.Json((await instanceUserMetaService.CreateAsync(request)).ToDto())
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IInstanceUserMetaService instanceUserMetaService,
                IJwtService jwtService,
                HttpRequest request
            ) =>
            {
                var token = request.ToAccessToken()!;
                var session = jwtService.ExtractSession(token);

                if (session == null)
                {
                    throw new UnauthorizedAccessException("Invalid access token.");
                }

                await instanceUserMetaService.DeleteAsync(id, session.UserId);

                return Results.Ok();
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IInstanceUserMetaService instanceUserMetaService
            ) => Results.Json((await instanceUserMetaService.GetAsync(id)).ToDto())
        );

        builder.MapGet(
            string.Empty,
            async (
                int instanceId,
                IInstanceUserMetaService instanceUserMetaService
            ) => Results.Json(
                (await instanceUserMetaService.GetByInstanceIdAsync(instanceId))
                .Select(i => i.ToDto())
                .ToList()
            )
        );
    }
}