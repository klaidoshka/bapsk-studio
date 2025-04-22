using Accounting.API.Configuration;
using Accounting.API.Util;
using Accounting.Contract.Dto.Report;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class ReportEndpoints
{
    public static void MapReportEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapPost("/generate-data-entries", GenerateDataEntriesReport)
            .RequireInstancePermission(InstancePermission.Report.Create)
            .RequireInstanceOwnsEntity<ReportTemplate>("reportTemplateId");

        builder
            .MapPost("/generate-sales", GenerateSalesReport)
            .RequireInstancePermission(InstancePermission.Report.Create)
            .RequireInstanceOwnsEntity<Customer>("customerId")
            .RequireInstanceOwnsEntity<Salesman>("salesmanId");
    }

    private static async Task<IResult> GenerateDataEntriesReport(
        [FromBody] ReportByDataEntriesGenerateRequest request,
        HttpContext httpContext,
        IReportService reportService
    )
    {
        request.RequesterId = httpContext.GetUserId();

        return Results.Json(await reportService.GenerateDataEntriesReportAsync(request));
    }

    private static async Task<IResult> GenerateSalesReport(
        [FromBody] ReportBySalesGenerateRequest request,
        HttpContext httpContext,
        IReportService reportService
    )
    {
        request.RequesterId = httpContext.GetUserId();

        return Results.Json(await reportService.GenerateSalesReportAsync(request));
    }
}