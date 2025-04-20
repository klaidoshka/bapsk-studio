using Accounting.API.Util;
using Accounting.Contract.Dto.ImportConfiguration;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class ImportConfigurationEndpoints
{
    public static void MapImportConfigurationEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(String.Empty, Create);
        builder.MapDelete("/{id:int}", Delete);
        builder.MapPut("/{id:int}", Edit);
        builder.MapGet("/{id:int}", GetById);
        builder.MapGet(String.Empty, GetBySomeId);
    }

    private static async Task<IResult> Create(
        [FromBody] ImportConfigurationCreateRequest request,
        IImportConfigurationService importConfigurationService,
        HttpContext httpContext
    )
    {
        request.RequesterId = httpContext.GetUserIdOrThrow();

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
                RequesterId = httpContext.GetUserIdOrThrow()
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
        request.RequesterId = httpContext.GetUserIdOrThrow();
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
                RequesterId = httpContext.GetUserIdOrThrow()
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
                RequesterId = httpContext.GetUserIdOrThrow()
            }
        ))
        .Select(i => i.ToDto())
        .ToList()
    );
}