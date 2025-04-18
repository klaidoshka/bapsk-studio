using Accounting.API.Util;
using Accounting.Contract.Dto.ReportTemplate;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class ReportTemplateEndpoints
{
    public static void MapReportTemplateEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            String.Empty,
            async (
                [FromBody] ReportTemplateCreateRequest request,
                IReportTemplateService importConfigurationService,
                HttpContext httpContext
            ) =>
            {
                request.RequesterId = httpContext.GetUserIdOrThrow();

                return Results.Json((await importConfigurationService.CreateAsync(request)).ToDto());
            }
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IReportTemplateService importConfigurationService,
                HttpContext httpContext
            ) =>
            {
                await importConfigurationService.DeleteAsync(
                    new ReportTemplateDeleteRequest
                    {
                        ReportTemplateId = id,
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
                [FromBody] ReportTemplateEditRequest request,
                IReportTemplateService importConfigurationService,
                HttpContext httpContext
            ) =>
            {
                request.ReportTemplate.Id = id;
                request.RequesterId = httpContext.GetUserIdOrThrow();

                await importConfigurationService.EditAsync(request);

                return Results.Ok();
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IReportTemplateService importConfigurationService,
                HttpContext httpContext
            ) => Results.Json(
                (await importConfigurationService.GetAsync(
                    new ReportTemplateGetRequest
                    {
                        ReportTemplateId = id,
                        RequesterId = httpContext.GetUserIdOrThrow()
                    }
                )).ToDto()
            )
        );

        builder.MapGet(
            String.Empty,
            async (
                int instanceId,
                IReportTemplateService importConfigurationService,
                HttpContext httpContext
            ) => Results.Json(
                (await importConfigurationService.GetByInstanceIdAsync(
                    new ReportTemplateGetByInstanceIdRequest()
                    {
                        InstanceId = instanceId,
                        RequesterId = httpContext.GetUserIdOrThrow()
                    }
                ))
                .Select(it => it.ToDto())
                .ToList()
            )
        );
    }
}