using Accounting.Contract.Dto.Sti.VatReturn.CancelDeclaration;
using Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;
using Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;
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

        endpoints.MapPost(
            "/submit-declaration",
            async (
                    [FromBody] SubmitDeclarationRequest request,
                    IStiVatReturnClientService stiService
                ) =>
                Results.Json(await stiService.SubmitDeclarationAsync(request))
        );
    }
}