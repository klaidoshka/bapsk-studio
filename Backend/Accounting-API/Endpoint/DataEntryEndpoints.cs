using Accounting.API.Util;
using Accounting.Contract.Dto;
using Accounting.Contract.Service;
using Accounting.Contract.Service.Request;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class DataEntryEndpoints
{
    public static void MapDataEntryEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            string.Empty,
            async (
                [FromBody] DataEntryCreateRequest request,
                IDataEntryService dataEntryService
            ) => Results.Json((await dataEntryService.CreateAsync(request)).ToDto())
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IDataEntryService dataEntryService,
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

                await dataEntryService.DeleteAsync(id, session.UserId);

                return Results.Ok();
            }
        );

        builder.MapPut(
            "/{id:int}",
            async (
                int id,
                [FromBody] DataEntryEditRequest request,
                IDataEntryService dataEntryService
            ) =>
            {
                request.Id = id;

                await dataEntryService.EditAsync(request);

                return Results.Ok();
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IDataEntryService dataEntryService
            ) => Results.Json((await dataEntryService.GetAsync(id)).ToDto())
        );

        builder.MapGet(
            string.Empty,
            async (
                int dataTypeId,
                IDataEntryService dataEntryService
            ) => Results.Json(
                (await dataEntryService.GetByDataTypeIdAsync(dataTypeId))
                .Select(i => i.ToDto())
                .ToList()
            )
        );
    }

    public static void MapDataEntryFieldEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            string.Empty,
            async (
                [FromBody] DataEntryFieldCreateRequest request,
                IDataEntryFieldService dataEntryFieldService
            ) => Results.Json((await dataEntryFieldService.CreateAsync(request)).ToDto())
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IDataEntryFieldService dataEntryFieldService
            ) =>
            {
                await dataEntryFieldService.DeleteAsync(id);

                return Results.Ok();
            }
        );

        builder.MapPut(
            "/{id:int}",
            async (
                int id,
                [FromBody] DataEntryFieldEditRequest request,
                IDataEntryFieldService dataEntryFieldService
            ) =>
            {
                request.Id = id;

                await dataEntryFieldService.EditAsync(request);

                return Results.Ok();
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IDataEntryFieldService dataEntryFieldService
            ) => Results.Json((await dataEntryFieldService.GetAsync(id)).ToDto())
        );

        builder.MapGet(
            string.Empty,
            async (
                int dataEntryId,
                IDataEntryFieldService dataEntryFieldService
            ) => Results.Json(
                (await dataEntryFieldService.GetByDataEntryIdAsync(dataEntryId))
                .Select(i => i.ToDto())
                .ToList()
            )
        );
    }
}