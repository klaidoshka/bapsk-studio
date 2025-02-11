using Accounting.API.Util;
using Accounting.Contract.Dto;
using Accounting.Contract.Service;
using Accounting.Contract.Service.Request;
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
                IDataTypeService dataTypeService
            ) => Results.Json((await dataTypeService.CreateAsync(request)).ToDto())
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
                var accessToken = request.ToAccessToken()!;
                var session = jwtService.ExtractSession(accessToken);

                if (session == null)
                {
                    throw new UnauthorizedAccessException("Invalid access token.");
                }

                await dataTypeService.DeleteAsync(id, session.UserId);

                return Results.Ok();
            }
        );

        builder.MapPut(
            "/{id:int}",
            async (
                int id,
                [FromBody] DataTypeEditRequest request,
                IDataTypeService dataTypeService
            ) =>
            {
                request.Id = id;

                await dataTypeService.EditAsync(request);

                return Results.Ok();
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IDataTypeService dataTypeService
            ) => Results.Json((await dataTypeService.GetAsync(id)).ToDto())
        );

        builder.MapGet(
            string.Empty,
            async (
                int instanceId,
                IDataTypeService dataTypeService
            ) => Results.Json(
                (await dataTypeService.GetByInstanceIdAsync(instanceId))
                .Select(i => i.ToDto())
                .ToList()
            )
        );
    }

    public static void MapDataTypeFieldEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            string.Empty,
            async (
                [FromBody] DataTypeFieldCreateRequest request,
                IDataTypeFieldService dataTypeFieldService
            ) => Results.Json((await dataTypeFieldService.CreateAsync(request)).ToDto())
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IDataTypeFieldService dataTypeFieldService,
                IJwtService jwtService,
                HttpRequest request
            ) =>
            {
                var accessToken = request.ToAccessToken()!;
                var session = jwtService.ExtractSession(accessToken);

                if (session == null)
                {
                    throw new UnauthorizedAccessException("Invalid access token.");
                }

                await dataTypeFieldService.DeleteAsync(id, session.UserId);

                return Results.Ok();
            }
        );

        builder.MapPut(
            "/{id:int}",
            async (
                int id,
                [FromBody] DataTypeFieldEditRequest request,
                IDataTypeFieldService dataTypeFieldService
            ) =>
            {
                request.Id = id;

                await dataTypeFieldService.EditAsync(request);

                return Results.Ok();
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IDataTypeFieldService dataTypeFieldService
            ) => Results.Json((await dataTypeFieldService.GetAsync(id)).ToDto())
        );

        builder.MapGet(
            string.Empty,
            async (
                int dataTypeId,
                IDataTypeFieldService dataTypeFieldService
            ) => Results.Json(
                (await dataTypeFieldService.GetByDataTypeIdAsync(dataTypeId))
                .Select(i => i.ToDto())
                .ToList()
            )
        );
    }
}