using Accounting.API.Configuration;
using Accounting.API.Util;
using Accounting.Contract.Dto.DataEntry;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;
using DataEntry = Accounting.Contract.Entity.DataEntry;

namespace Accounting.API.Endpoint;

public static class DataEntryEndpoints
{
    public static void MapDataEntryEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapPost(String.Empty, Create)
            .RequireInstancePermission(InstancePermission.DataEntry.Create);

        builder
            .MapPost("import", Import)
            .RequireInstancePermission(InstancePermission.DataEntry.Create)
            .RequireInstanceOwnsEntity<ImportConfiguration>("importConfigurationId");

        builder
            .MapDelete("/{id:int}", Delete)
            .RequireInstancePermission(InstancePermission.DataEntry.Delete)
            .RequireInstanceOwnsEntity<DataEntry>();

        builder
            .MapPut("/{id:int}", Edit)
            .RequireInstancePermission(InstancePermission.DataEntry.Edit)
            .RequireInstanceOwnsEntity<DataEntry>();

        builder
            .MapGet("/{id:int}", GetById)
            .RequireInstancePermission(InstancePermission.DataEntry.Preview)
            .RequireInstanceOwnsEntity<DataEntry>();

        builder
            .MapGet(String.Empty, GetByDataType)
            .RequireInstancePermission(InstancePermission.DataEntry.Preview)
            .RequireInstanceOwnsEntity<DataType>("dataTypeId");
    }

    private static async Task<IResult> Create(
        [FromBody] DataEntryCreateRequest request,
        IDataEntryService dataEntryService,
        HttpContext httpContext
    )
    {
        request.RequesterId = httpContext.GetUserId();

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
                    RequesterId = httpContext.GetUserId(),
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
                RequesterId = httpContext.GetUserId()
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
        request.RequesterId = httpContext.GetUserId();

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
                RequesterId = httpContext.GetUserId()
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
                RequesterId = httpContext.GetUserId()
            }
        ))
        .Select(i => i.ToDto())
        .ToList()
    );
}