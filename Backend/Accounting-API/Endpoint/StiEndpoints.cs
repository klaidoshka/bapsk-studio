using Accounting.Contract.Service;
using Accounting.Contract.Sti.CancelDeclaration;
using Accounting.Contract.Sti.ExportedGoods;
using Accounting.Contract.Sti.QueryDeclarations;
using Accounting.Contract.Sti.SubmitDeclaration;
using Accounting.Contract.Sti.SubmitPaymentInfo;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class StiEndpoints
{
    public static void MapStiEndpoints(this RouteGroupBuilder endpoints)
    {
        endpoints.MapPost(
            "/cancel-declaration",
            async ([FromBody] CancelDeclarationRequest request, IStiService stiService) =>
            Results.Json(await stiService.CancelDeclarationAsync(request))
        );

        endpoints.MapGet(
            "/exported-goods",
            async ([FromBody] ExportedGoodsRequest request, IStiService stiService) =>
            Results.Json(await stiService.GetInfoOnExportedGoodsAsync(request))
        );

        endpoints.MapGet(
            "/query-declarations",
            async ([FromBody] QueryDeclarationsRequest request, IStiService stiService) =>
            Results.Json(await stiService.QueryDeclarationsAsync(request))
        );

        endpoints.MapPost(
            "/submit-declaration",
            async ([FromBody] SubmitDeclarationRequest request, IStiService stiService) =>
            Results.Json(await stiService.SubmitDeclarationAsync(request))
        );

        endpoints.MapPost(
            "/submit-payment-info",
            async ([FromBody] SubmitPaymentInfoRequest request, IStiService stiService) =>
            Results.Json(await stiService.SubmitPaymentInfoAsync(request))
        );
    }
}