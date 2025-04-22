using Accounting.API.Configuration;
using Accounting.API.Util;
using Accounting.Contract.Dto.ReportTemplate;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class ReportTemplateEndpoints
{
    public static void MapReportTemplateEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapPost(String.Empty, Create)
            .RequireInstancePermission(InstancePermission.ReportTemplate.Create);

        builder
            .MapDelete("/{id:int}", Delete)
            .RequireInstancePermission(InstancePermission.ReportTemplate.Delete)
            .RequireInstanceOwnsEntity<ReportTemplate>();

        builder
            .MapPut("/{id:int}", Edit)
            .RequireInstancePermission(InstancePermission.ReportTemplate.Edit)
            .RequireInstanceOwnsEntity<ReportTemplate>();

        builder
            .MapGet("/{id:int}", GetById)
            .RequireInstancePermission(InstancePermission.ReportTemplate.Preview)
            .RequireInstanceOwnsEntity<ReportTemplate>();

        builder
            .MapGet(String.Empty, GetByInstanceId)
            .RequireInstancePermission(InstancePermission.ReportTemplate.Preview);
    }

    private static async Task<IResult> Create(
        [FromBody] ReportTemplateCreateRequest request,
        IReportTemplateService importConfigurationService,
        HttpContext httpContext
    )
    {
        request.RequesterId = httpContext.GetUserId();

        return Results.Json((await importConfigurationService.CreateAsync(request)).ToDto());
    }

    private static async Task<IResult> Delete(
        int id,
        IReportTemplateService importConfigurationService,
        HttpContext httpContext
    )
    {
        await importConfigurationService.DeleteAsync(
            new ReportTemplateDeleteRequest
            {
                ReportTemplateId = id,
                RequesterId = httpContext.GetUserId()
            }
        );

        return Results.Ok();
    }

    private static async Task<IResult> Edit(
        int id,
        [FromBody] ReportTemplateEditRequest request,
        IReportTemplateService importConfigurationService,
        HttpContext httpContext
    )
    {
        request.ReportTemplate.Id = id;
        request.RequesterId = httpContext.GetUserId();

        await importConfigurationService.EditAsync(request);

        return Results.Ok();
    }

    private static async Task<IResult> GetById(
        int id,
        IReportTemplateService importConfigurationService,
        HttpContext httpContext
    ) => Results.Json(
        (await importConfigurationService.GetAsync(
            new ReportTemplateGetRequest
            {
                ReportTemplateId = id,
                RequesterId = httpContext.GetUserId()
            }
        )).ToDto()
    );

    private static async Task<IResult> GetByInstanceId(
        int instanceId,
        IReportTemplateService importConfigurationService,
        HttpContext httpContext
    ) => Results.Json(
        (await importConfigurationService.GetAsync(
            new ReportTemplateGetByInstanceIdRequest
            {
                InstanceId = instanceId,
                RequesterId = httpContext.GetUserId()
            }
        ))
        .Select(it => it.ToDto())
        .ToList()
    );
}