using Accounting.API.Configuration;
using Accounting.API.Util;
using Accounting.Contract.Dto.ImportConfiguration;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;
using ImportConfiguration = Accounting.Contract.Entity.ImportConfiguration;

namespace Accounting.API.Endpoint;

public static class ImportConfigurationEndpoints
{
    public static void MapImportConfigurationEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapPost(String.Empty, Create)
            .RequireInstancePermission(InstancePermission.ImportConfiguration.Create);

        builder
            .MapDelete("/{id:int}", Delete)
            .RequireInstancePermission(InstancePermission.ImportConfiguration.Delete)
            .RequireInstanceOwnsEntity<ImportConfiguration>();

        builder
            .MapPut("/{id:int}", Edit)
            .RequireInstancePermission(InstancePermission.ImportConfiguration.Edit)
            .RequireInstanceOwnsEntity<ImportConfiguration>();

        builder
            .MapGet("/{id:int}", GetById)
            .RequireInstancePermission(InstancePermission.ImportConfiguration.Preview)
            .RequireInstanceOwnsEntity<ImportConfiguration>();

        builder
            .MapGet(String.Empty, GetBySomeId)
            .RequireInstancePermission(InstancePermission.ImportConfiguration.Preview)
            .RequireInstanceOwnsEntity<DataType>("dataTypeId", entityIdOptional: true);
    }

    private static async Task<IResult> Create(
        [FromBody] ImportConfigurationCreateRequest request,
        IImportConfigurationService importConfigurationService,
        HttpContext httpContext
    )
    {
        request.RequesterId = httpContext.GetUserId();

        return Results.Json((await importConfigurationService.CreateAsync(request)).ToDto());
    }

    private static async Task<IResult> Delete(
        int id,
        IImportConfigurationService importConfigurationService,
        HttpContext httpContext
    )
    {
        await importConfigurationService.DeleteAsync(
            new ImportConfigurationDeleteRequest
            {
                ImportConfigurationId = id,
                RequesterId = httpContext.GetUserId()
            }
        );

        return Results.Ok();
    }

    private static async Task<IResult> Edit(
        int id,
        [FromBody] ImportConfigurationEditRequest request,
        IImportConfigurationService importConfigurationService,
        HttpContext httpContext
    )
    {
        request.ImportConfiguration.Id = id;
        request.RequesterId = httpContext.GetUserId();
        await importConfigurationService.EditAsync(request);

        return Results.Ok();
    }

    private static async Task<IResult> GetById(
        int id,
        IImportConfigurationService importConfigurationService,
        HttpContext httpContext
    ) => Results.Json(
        (await importConfigurationService.GetAsync(
            new ImportConfigurationGetRequest
            {
                ImportConfigurationId = id,
                RequesterId = httpContext.GetUserId()
            }
        )).ToDto()
    );

    private static async Task<IResult> GetBySomeId(
        int? instanceId,
        int? dataTypeId,
        IImportConfigurationService importConfigurationService,
        HttpContext httpContext
    ) => Results.Json(
        (await importConfigurationService.GetAsync(
            new ImportConfigurationGetBySomeIdRequest
            {
                DataTypeId = dataTypeId,
                InstanceId = instanceId,
                RequesterId = httpContext.GetUserId()
            }
        ))
        .Select(i => i.ToDto())
        .ToList()
    );
}