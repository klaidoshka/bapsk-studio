using Accounting.Contract.Dto.Report;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class ReportEndpoints
{
    public static void MapReportEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapPost("generate/data-entry-report", GenerateDataEntriesReport)
            .RequireAuthorization();

        builder
            .MapPost("generate/sale-reports", GenerateSalesReport)
            .RequireAuthorization();
    }

    private static async Task<IResult> GenerateDataEntriesReport(
        [FromBody] ReportByDataEntriesGenerateRequest request,
        IReportService reportService
    ) => Results.Json(await reportService.GenerateDataEntriesReportAsync(request));

    private static async Task<IResult> GenerateSalesReport(
        [FromBody] ReportBySalesGenerateRequest request,
        IReportService reportService
    ) => Results.Json(await reportService.GenerateSalesReportAsync(request));
}