using Accounting.API.Util;
using Accounting.Contract.Dto.DataType;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class DataTypeEndpoints
{
    public static void MapDataTypeEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(String.Empty, Create);
        builder.MapDelete("/{id:int}", Delete);
        builder.MapPut("/{id:int}", Edit);
        builder.MapGet("/{id:int}", GetById);
        builder.MapGet(String.Empty, GetByInstance);
    }

    private static async Task<IResult> Create(
        [FromBody] DataTypeCreateRequest request,
        IDataTypeService dataTypeService,
        HttpContext httpContext
    )
    {
        request.RequesterId = httpContext.GetUserIdOrThrow();

        return Results.Json((await dataTypeService.CreateAsync(request)).ToDto());
    }

    private static async Task<IResult> Delete(
        int id,
        IDataTypeService dataTypeService,
        HttpContext httpContext
    )
    {
        await dataTypeService.DeleteAsync(
            new DataTypeDeleteRequest
            {
                DataTypeId = id,
                RequesterId = httpContext.GetUserIdOrThrow()
            }
        );

        return Results.Ok();
    }

    private static async Task<IResult> Edit(
        int id,
        [FromBody] DataTypeEditRequest request,
        IDataTypeService dataTypeService,
        HttpContext httpContext
    )
    {
        request.DataTypeId = id;
        request.RequesterId = httpContext.GetUserIdOrThrow();
        await dataTypeService.EditAsync(request);

        return Results.Ok();
    }

    private static async Task<IResult> GetById(
        int id,
        IDataTypeService dataTypeService,
        HttpContext httpContext
    ) => Results.Json(
        (await dataTypeService.GetAsync(
            new DataTypeGetRequest
            {
                DataTypeId = id,
                RequesterId = httpContext.GetUserIdOrThrow()
            }
        )).ToDto()
    );

    private static async Task<IResult> GetByInstance(
        int instanceId,
        IDataTypeService dataTypeService,
        HttpContext httpContext
    ) => Results.Json(
        (await dataTypeService.GetAsync(
            new DataTypeGetByInstanceRequest
            {
                InstanceId = instanceId,
                RequesterId = httpContext.GetUserIdOrThrow()
            }
        ))
        .Select(i => i.ToDto())
        .ToList()
    );
}