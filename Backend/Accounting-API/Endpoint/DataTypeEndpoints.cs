using Accounting.API.Configuration;
using Accounting.API.Util;
using Accounting.Contract.Dto.DataType;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;
using DataType = Accounting.Contract.Entity.DataType;

namespace Accounting.API.Endpoint;

public static class DataTypeEndpoints
{
    public static void MapDataTypeEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapPost(String.Empty, Create)
            .RequireInstancePermission(InstancePermission.DataType.Create);

        builder
            .MapDelete("/{id:int}", Delete)
            .RequireInstancePermission(InstancePermission.DataType.Delete)
            .RequireInstanceOwnsEntity<DataType>();

        builder
            .MapPut("/{id:int}", Edit)
            .RequireInstancePermission(InstancePermission.DataType.Edit)
            .RequireInstanceOwnsEntity<DataType>();

        builder
            .MapGet("/{id:int}", GetById)
            .RequireInstancePermission(InstancePermission.DataType.Preview)
            .RequireInstanceOwnsEntity<DataType>();

        builder
            .MapGet(String.Empty, GetByInstance)
            .RequireInstancePermission(InstancePermission.DataType.Preview);
    }

    private static async Task<IResult> Create(
        [FromBody] DataTypeCreateRequest request,
        IDataTypeService dataTypeService,
        HttpContext httpContext
    )
    {
        request.RequesterId = httpContext.GetUserId();

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
                RequesterId = httpContext.GetUserId()
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
        request.RequesterId = httpContext.GetUserId();
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
                RequesterId = httpContext.GetUserId()
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
                RequesterId = httpContext.GetUserId()
            }
        ))
        .Select(i => i.ToDto())
        .ToList()
    );
}