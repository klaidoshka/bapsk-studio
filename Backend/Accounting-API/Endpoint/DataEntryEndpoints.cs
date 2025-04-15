using Accounting.API.Util;
using Accounting.Contract.Dto.DataEntry;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;
using DataEntryImportRequest = Accounting.API.Dto.DataEntryImportRequest;

namespace Accounting.API.Endpoint;

public static class DataEntryEndpoints
{
    public static void MapDataEntryEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            String.Empty,
            async (
                [FromBody] DataEntryCreateRequest request,
                IDataEntryService dataEntryService,
                HttpContext httpContext
            ) =>
            {
                request.RequesterId = httpContext.GetUserIdOrThrow();

                return Results.Json((await dataEntryService.CreateAsync(request)).ToDto());
            }
        );

        builder.MapPost(
            "import",
            async (
                [FromBody] DataEntryImportRequest request,
                IDataEntryService dataEntryService,
                HttpContext httpContext
            ) =>
            {
                await using var fileStream = request.File.OpenReadStream();
                
                return Results.Json(await dataEntryService.ImportAsync(new Contract.Dto.DataEntry.DataEntryImportRequest
                {
                    DataTypeId = request.DataTypeId,
                    FileName = request.File.FileName,
                    FileStream = fileStream,
                    ImportConfigurationId = request.ImportConfigurationId,
                    RequesterId = httpContext.GetUserIdOrThrow()
                }));
            }
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IDataEntryService dataEntryService,
                HttpContext httpContext
            ) =>
            {
                await dataEntryService.DeleteAsync(
                    new DataEntryDeleteRequest
                    {
                        DataEntryId = id,
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
                [FromBody] DataEntryEditRequest request,
                IDataEntryService dataEntryService,
                HttpContext httpContext
            ) =>
            {
                request.DataEntryId = id;
                request.RequesterId = httpContext.GetUserIdOrThrow();

                await dataEntryService.EditAsync(request);

                return Results.Ok();
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IDataEntryService dataEntryService,
                HttpContext httpContext
            ) => Results.Json(
                (await dataEntryService.GetAsync(
                    new DataEntryGetRequest
                    {
                        DataEntryId = id,
                        RequesterId = httpContext.GetUserIdOrThrow()
                    }
                )).ToDto()
            )
        );

        builder.MapGet(
            String.Empty,
            async (
                int dataTypeId,
                IDataEntryService dataEntryService,
                HttpContext httpContext
            ) => Results.Json(
                (await dataEntryService.GetByDataTypeIdAsync(
                    new DataEntryGetByDataTypeRequest
                    {
                        DataTypeId = dataTypeId,
                        RequesterId = httpContext.GetUserIdOrThrow()
                    }
                ))
                .Select(i => i.ToDto())
                .ToList()
            )
        );
    }
}