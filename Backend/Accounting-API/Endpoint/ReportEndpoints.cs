using Accounting.API.Util;
using Accounting.Contract.Dto.Report;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class ReportEndpoints
{
    public static void MapReportEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapPost("/generate-data-entries", GenerateDataEntriesReport)
            .RequireAuthorization();

        builder
            .MapPost("/generate-sales", GenerateSalesReport)
            .RequireAuthorization();
    }

    private static async Task<IResult> GenerateDataEntriesReport(
        [FromBody] ReportByDataEntriesGenerateRequest request,
        HttpContext httpContext,
        IReportService reportService
    )
    {
        request.RequesterId = httpContext.GetUserIdOrThrow();

        return Results.Json(await reportService.GenerateDataEntriesReportAsync(request));
    }

    private static async Task<IResult> GenerateSalesReport(
        [FromBody] ReportBySalesGenerateRequest request,
        HttpContext httpContext,
        IReportService reportService
    )
    {
        request.RequesterId = httpContext.GetUserIdOrThrow();

        return Results.Json(await reportService.GenerateSalesReportAsync(request));
    }
}