using Accounting.Contract.Dto.StiVatReturn.CancelDeclaration;
using Accounting.Contract.Dto.StiVatReturn.ExportedGoods;
using Accounting.Contract.Dto.StiVatReturn.QueryDeclarations;
using Accounting.Contract.Dto.StiVatReturn.SubmitDeclaration;
using Accounting.Contract.Dto.StiVatReturn.SubmitPaymentInfo;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class StiEndpoints
{
    public static void MapStiEndpoints(this RouteGroupBuilder endpoints)
    {
        endpoints.MapPost(
            "/cancel-declaration",
            async (
                    [FromBody] CancelDeclarationRequest request,
                    IStiVatReturnClientService stiService
                ) =>
            Results.Json(await stiService.CancelDeclarationAsync(request))
        );

        endpoints.MapGet(
            "/exported-goods",
            async (
                    [FromBody] ExportedGoodsRequest request,
                    IStiVatReturnClientService stiService
                ) =>
            Results.Json(await stiService.GetInfoOnExportedGoodsAsync(request))
        );

        endpoints.MapGet(
            "/query-declarations",
            async (
                    [FromBody] QueryDeclarationsRequest request,
                    IStiVatReturnClientService stiService
                ) =>
            Results.Json(await stiService.QueryDeclarationsAsync(request))
        );

        endpoints.MapPost(
            "/submit-declaration",
            async (
                    [FromBody] SubmitDeclarationRequest request,
                    IStiVatReturnClientService stiService
                ) =>
            Results.Json(await stiService.SubmitDeclarationAsync(request))
        );

        endpoints.MapPost(
            "/submit-payment-info",
            async (
                    [FromBody] SubmitPaymentInfoRequest request,
                    IStiVatReturnClientService stiService
                ) =>
            Results.Json(await stiService.SubmitPaymentInfoAsync(request))
        );
    }
}