using Accounting.API.Util;
using Accounting.Contract.Dto.Instance;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class InstanceEndpoints
{
    public static void MapInstanceEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            String.Empty,
            async (
                [FromBody] InstanceCreateRequest request,
                HttpRequest httpRequest,
                IJwtService jwtService,
                IInstanceService instanceService
            ) =>
            {
                request.RequesterId = await httpRequest.GetUserIdAsync(jwtService);

                return Results.Json((await instanceService.CreateAsync(request)).ToDto());
            }
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IInstanceService instanceService,
                HttpRequest httpRequest,
                IJwtService jwtService
            ) =>
            {
                await instanceService.DeleteAsync(
                    new InstanceDeleteRequest
                    {
                        InstanceId = id,
                        RequesterId = await httpRequest.GetUserIdAsync(jwtService)
                    }
                );

                return Results.Ok();
            }
        );

        builder.MapPut(
            "/{id:int}",
            async (
                int id,
                [FromBody] InstanceEditRequest request,
                HttpRequest httpRequest,
                IJwtService jwtService,
                IInstanceService instanceService
            ) =>
            {
                request.InstanceId = id;
                request.RequesterId = await httpRequest.GetUserIdAsync(jwtService);

                await instanceService.EditAsync(request);

                return Results.Ok();
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                HttpRequest httpRequest,
                IJwtService jwtService,
                IInstanceService instanceService
            ) => Results.Json(
                (await instanceService.GetAsync(
                    new InstanceGetRequest
                    {
                        InstanceId = id,
                        RequesterId = await httpRequest.GetUserIdAsync(jwtService)
                    }
                )).ToDto()
            )
        );

        builder.MapGet(
            String.Empty,
            async (
                HttpRequest httpRequest,
                IJwtService jwtService,
                IInstanceService instanceService
            ) => Results.Json(
                (await instanceService.GetByUserIdAsync(
                    new InstanceGetByUserRequest
                    {
                        RequesterId = await httpRequest.GetUserIdAsync(jwtService)
                    }
                ))
                .Select(i => i.ToDto())
                .ToList()
            )
        );
    }

    public static void MapInstanceMetaEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            String.Empty,
            async (
                [FromBody] InstanceUserMetaCreateRequest request,
                HttpRequest httpRequest,
                IJwtService jwtService,
                IInstanceUserMetaService instanceUserMetaService
            ) =>
            {
                request.RequesterId = await httpRequest.GetUserIdAsync(jwtService);

                return Results.Json((await instanceUserMetaService.CreateAsync(request)).ToDto());
            }
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
                await instanceUserMetaService.DeleteAsync(
                    new InstanceUserMetaDeleteRequest
                    {
                        InstanceUserMetaId = id,
                        RequesterId = await request.GetUserIdAsync(jwtService)
                    }
                );

                return Results.Ok();
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                HttpRequest httpRequest,
                IJwtService jwtService,
                IInstanceUserMetaService instanceUserMetaService
            ) => Results.Json(
                (await instanceUserMetaService.GetAsync(
                    new InstanceUserMetaGetRequest
                    {
                        InstanceUserMetaId = id,
                        RequesterId = await httpRequest.GetUserIdAsync(jwtService)
                    }
                )).ToDto()
            )
        );

        builder.MapGet(
            String.Empty,
            async (
                int instanceId,
                HttpRequest httpRequest,
                IJwtService jwtService,
                IInstanceUserMetaService instanceUserMetaService
            ) => Results.Json(
                (await instanceUserMetaService.GetByInstanceIdAsync(
                    new InstanceUserMetaGetByInstanceRequest
                    {
                        InstanceId = instanceId,
                        RequesterId = await httpRequest.GetUserIdAsync(jwtService)
                    }
                ))
                .Select(i => i.ToDto())
                .ToList()
            )
        );
    }
}