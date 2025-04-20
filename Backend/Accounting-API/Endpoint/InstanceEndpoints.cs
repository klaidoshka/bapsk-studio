using Accounting.API.Util;
using Accounting.Contract.Dto.Instance;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class InstanceEndpoints
{
    public static void MapInstanceEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(String.Empty, Create);
        builder.MapDelete("/{id:int}", Delete);
        builder.MapPut("/{id:int}", Edit);
        builder.MapGet("/{id:int}", GetById);
        builder.MapGet(String.Empty, GetByUser);
    }

    private static async Task<IResult> Create(
        [FromBody] InstanceCreateRequest request,
        HttpContext httpContext,
        IInstanceService instanceService
    )
    {
        request.RequesterId = httpContext.GetUserIdOrThrow();

        return Results.Json((await instanceService.CreateAsync(request)).ToDto());
    }

    private static async Task<IResult> Delete(
        int id,
        IInstanceService instanceService,
        HttpContext httpContext
    )
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

    private static async Task<IResult> Edit(
        int id,
        [FromBody] InstanceEditRequest request,
        HttpContext httpContext,
        IInstanceService instanceService
    )
    {
        request.InstanceId = id;
        request.RequesterId = httpContext.GetUserIdOrThrow();
        await instanceService.EditAsync(request);

        return Results.Ok();
    }

    private static async Task<IResult> GetById(
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
    );

    private static async Task<IResult> GetByUser(
        HttpContext httpContext,
        IInstanceService instanceService
    ) => Results.Json(
        (await instanceService.GetAsync(
            new InstanceGetByUserRequest
            {
                RequesterId = httpContext.GetUserIdOrThrow()
            }
        ))
        .Select(i => i.ToDto())
        .ToList()
    );
}