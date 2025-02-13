using Accounting.API.Util;
using Accounting.Contract.Dto;
using Accounting.Contract.Request;
using Accounting.Contract.Service;
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
                IDataEntryService dataEntryService,
                HttpRequest httpRequest,
                IJwtService jwtService
            ) =>
            {
                request.RequesterId = await httpRequest.GetUserIdAsync(jwtService);

                return Results.Json((await dataEntryService.CreateAsync(request)).ToDto());
            }
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IDataEntryService dataEntryService,
                IJwtService jwtService,
                HttpRequest httpRequest
            ) =>
            {
                await dataEntryService.DeleteAsync(
                    new DataEntryDeleteRequest
                    {
                        DataEntryId = id,
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
                [FromBody] DataEntryEditRequest request,
                IDataEntryService dataEntryService,
                HttpRequest httpRequest,
                IJwtService jwtService
            ) =>
            {
                request.DataEntryId = id;
                request.RequesterId = await httpRequest.GetUserIdAsync(jwtService);

                await dataEntryService.EditAsync(request);

                return Results.Ok();
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IDataEntryService dataEntryService,
                HttpRequest httpRequest,
                IJwtService jwtService
            ) => Results.Json(
                (await dataEntryService.GetAsync(
                    new DataEntryGetRequest
                    {
                        DataEntryId = id,
                        RequesterId = await httpRequest.GetUserIdAsync(jwtService)
                    }
                )).ToDto()
            )
        );

        builder.MapGet(
            string.Empty,
            async (
                int dataTypeId,
                IDataEntryService dataEntryService,
                HttpRequest httpRequest,
                IJwtService jwtService
            ) => Results.Json(
                (await dataEntryService.GetByDataTypeIdAsync(
                    new DataEntryGetByDataTypeRequest
                    {
                        DataTypeId = dataTypeId,
                        RequesterId = await httpRequest.GetUserIdAsync(jwtService)
                    }
                ))
                .Select(i => i.ToDto())
                .ToList()
            )
        );
    }
}