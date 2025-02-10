using Accounting.API.Util;
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
            ) => await dataTypeService.CreateAsync(request)
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IDataTypeService dataTypeService
            ) => await dataTypeService.DeleteAsync(id)
        );

        builder.MapPatch(
            "/{id:int}",
            async (
                int id,
                [FromBody] DataTypeEditRequest request,
                IDataTypeService dataTypeService
            ) =>
            {
                request.Id = id;

                await dataTypeService.EditAsync(request);
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IDataTypeService dataTypeService
            ) => await dataTypeService.GetAsync(id)
        );

        builder.MapGet(
            string.Empty,
            async (
                int instanceId,
                IDataTypeService dataTypeService
            ) => await dataTypeService.GetByInstanceIdAsync(instanceId)
        );
    }

    public static void MapDataTypeFieldEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            string.Empty,
            async (
                [FromBody] DataTypeFieldCreateRequest request,
                IDataTypeFieldService dataTypeFieldService
            ) => await dataTypeFieldService.CreateAsync(request)
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
            }
        );

        builder.MapPatch(
            "/{id:int}",
            async (
                int id,
                [FromBody] DataTypeFieldEditRequest request,
                IDataTypeFieldService dataTypeFieldService
            ) =>
            {
                request.Id = id;

                await dataTypeFieldService.EditAsync(request);
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IDataTypeFieldService dataTypeFieldService
            ) => await dataTypeFieldService.GetAsync(id)
        );

        builder.MapGet(
            string.Empty,
            async (
                int dataTypeId,
                IDataTypeFieldService dataTypeFieldService
            ) => await dataTypeFieldService.GetByDataTypeIdAsync(dataTypeId)
        );
    }
}