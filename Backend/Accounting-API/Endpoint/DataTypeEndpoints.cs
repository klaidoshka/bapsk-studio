using Accounting.API.Util;
using Accounting.Contract.Dto.DataType;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class DataTypeEndpoints
{
    public static void MapDataTypeEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            String.Empty,
            async (
                [FromBody] DataTypeCreateRequest request,
                IDataTypeService dataTypeService,
                HttpContext httpContext
            ) =>
            {
                request.RequesterId = httpContext.GetUserIdOrThrow();

                return Results.Json((await dataTypeService.CreateAsync(request)).ToDto());
            }
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IDataTypeService dataTypeService,
                HttpContext httpContext
            ) =>
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
        );

        builder.MapPut(
            "/{id:int}",
            async (
                int id,
                [FromBody] DataTypeEditRequest request,
                IDataTypeService dataTypeService,
                HttpContext httpContext
            ) =>
            {
                request.DataTypeId = id;
                request.RequesterId = httpContext.GetUserIdOrThrow();

                await dataTypeService.EditAsync(request);

                return Results.Ok();
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
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
            )
        );

        builder.MapGet(
            String.Empty,
            async (
                int instanceId,
                IDataTypeService dataTypeService,
                HttpContext httpContext
            ) => Results.Json(
                (await dataTypeService.GetByInstanceIdAsync(
                    new DataTypeGetByInstanceRequest
                    {
                        InstanceId = instanceId,
                        RequesterId = httpContext.GetUserIdOrThrow()
                    }
                ))
                .Select(i => i.ToDto())
                .ToList()
            )
        );
    }
}