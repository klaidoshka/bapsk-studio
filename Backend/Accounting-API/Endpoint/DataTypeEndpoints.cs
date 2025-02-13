using Accounting.API.Util;
using Accounting.Contract.Dto;
using Accounting.Contract.Request;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class DataTypeEndpoints
{
    public static void MapDataTypeEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            string.Empty,
            async (
                [FromBody] DataTypeCreateRequest request,
                IDataTypeService dataTypeService,
                HttpRequest httpRequest,
                IJwtService jwtService
            ) =>
            {
                request.RequesterId = await httpRequest.GetUserIdAsync(jwtService);

                return Results.Json((await dataTypeService.CreateAsync(request)).ToDto());
            }
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IDataTypeService dataTypeService,
                IJwtService jwtService,
                HttpRequest request
            ) =>
            {
                await dataTypeService.DeleteAsync(
                    new DataTypeDeleteRequest
                    {
                        DataTypeId = id,
                        RequesterId = await request.GetUserIdAsync(jwtService)
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
                HttpRequest httpRequest,
                IJwtService jwtService
            ) =>
            {
                request.DataTypeId = id;
                request.RequesterId = await httpRequest.GetUserIdAsync(jwtService);

                await dataTypeService.EditAsync(request);

                return Results.Ok();
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IDataTypeService dataTypeService,
                HttpRequest httpRequest,
                IJwtService jwtService
            ) => Results.Json(
                (await dataTypeService.GetAsync(
                    new DataTypeGetRequest
                    {
                        DataTypeId = id,
                        RequesterId = await httpRequest.GetUserIdAsync(jwtService)
                    }
                )).ToDto()
            )
        );

        builder.MapGet(
            string.Empty,
            async (
                int instanceId,
                IDataTypeService dataTypeService,
                HttpRequest httpRequest,
                IJwtService jwtService
            ) => Results.Json(
                (await dataTypeService.GetByInstanceIdAsync(
                    new DataTypeGetByInstanceRequest
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