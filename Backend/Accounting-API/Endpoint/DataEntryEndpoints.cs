using Accounting.API.Util;
using Accounting.Contract.Dto.DataEntry;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class DataEntryEndpoints
{
    public static void MapDataEntryEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(String.Empty, Create);
        builder.MapPost("import", Import);
        builder.MapDelete("/{id:int}", Delete);
        builder.MapPut("/{id:int}", Edit);
        builder.MapGet("/{id:int}", GetById);
        builder.MapGet(String.Empty, GetByDataType);
    }

    private static async Task<IResult> Create(
        [FromBody] DataEntryCreateRequest request,
        IDataEntryService dataEntryService,
        HttpContext httpContext
    )
    {
        request.RequesterId = httpContext.GetUserIdOrThrow();

        return Results.Json((await dataEntryService.CreateAsync(request)).ToDto());
    }

    private static async Task<IResult> Import(
        [FromForm] IFormFile file,
        [FromForm] int importConfigurationId,
        [FromForm] bool skipHeader,
        IDataEntryService dataEntryService,
        HttpContext httpContext
    )
    {
        if (file == null || file.Length == 0)
        {
            return Results.BadRequest("Data entries import file is required.");
        }

        await using var fileStream = file.OpenReadStream();

        return Results.Json(
            (await dataEntryService.ImportAsync(
                new DataEntryImportRequest
                {
                    FileExtension = "." + file.FileName.Split(".").Last(),
                    FileStream = fileStream,
                    ImportConfigurationId = importConfigurationId,
                    RequesterId = httpContext.GetUserIdOrThrow(),
                    SkipHeader = skipHeader
                }
            ))
            .Select(i => i.ToDto())
            .ToList()
        );
    }

    private static async Task<IResult> Delete(
        int id,
        IDataEntryService dataEntryService,
        HttpContext httpContext
    )
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

    private static async Task<IResult> Edit(
        int id,
        [FromBody] DataEntryEditRequest request,
        IDataEntryService dataEntryService,
        HttpContext httpContext
    )
    {
        request.DataEntryId = id;
        request.RequesterId = httpContext.GetUserIdOrThrow();

        await dataEntryService.EditAsync(request);

        return Results.Ok();
    }

    private static async Task<IResult> GetById(
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
    );

    private static async Task<IResult> GetByDataType(
        int dataTypeId,
        IDataEntryService dataEntryService,
        HttpContext httpContext
    ) => Results.Json(
        (await dataEntryService.GetAsync(
            new DataEntryGetByDataTypeRequest
            {
                DataTypeId = dataTypeId,
                RequesterId = httpContext.GetUserIdOrThrow()
            }
        ))
        .Select(i => i.ToDto())
        .ToList()
    );
}