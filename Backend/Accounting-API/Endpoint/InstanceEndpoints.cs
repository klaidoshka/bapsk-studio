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
                HttpContext httpContext,
                IInstanceService instanceService
            ) =>
            {
                request.RequesterId = httpContext.GetUserIdOrThrow();

                return Results.Json((await instanceService.CreateAsync(request)).ToDto());
            }
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IInstanceService instanceService,
                HttpContext httpContext
            ) =>
            {
                await instanceService.DeleteAsync(
                    new InstanceDeleteRequest
                    {
                        InstanceId = id,
                        RequesterId = httpContext.GetUserIdOrThrow()
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
                HttpContext httpContext,
                IInstanceService instanceService
            ) =>
            {
                request.InstanceId = id;
                request.RequesterId = httpContext.GetUserIdOrThrow();

                await instanceService.EditAsync(request);

                return Results.Ok();
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                HttpContext httpContext,
                IInstanceService instanceService
            ) => Results.Json(
                (await instanceService.GetAsync(
                    new InstanceGetRequest
                    {
                        InstanceId = id,
                        RequesterId = httpContext.GetUserIdOrThrow()
                    }
                )).ToDto()
            )
        );

        builder.MapGet(
            String.Empty,
            async (
                HttpContext httpContext,
                IInstanceService instanceService
            ) => Results.Json(
                (await instanceService.GetByUserIdAsync(
                    new InstanceGetByUserRequest
                    {
                        RequesterId = httpContext.GetUserIdOrThrow()
                    }
                ))
                .Select(i => i.ToDto())
                .ToList()
            )
        );
    }
}