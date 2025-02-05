using System.ComponentModel.DataAnnotations;
using System.ServiceModel;
using Accounting.Contract.Sti;
using Accounting.Contract.Sti.Data;
using Accounting.Contract.Sti.Data.CancelDeclaration;
using Accounting.Contract.Sti.Data.ExportedGoods;
using Accounting.Contract.Sti.Data.QueryDeclarations;
using Accounting.Contract.Sti.Data.SubmitDeclaration;
using Accounting.Contract.Sti.Data.SubmitPaymentInfo;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class StiEndpoints
{
    /// <summary>
    /// Maps STI endpoints under the specified route group.
    /// POST: /cancel-declaration
    /// GET: /exported-goods
    /// GET: /query-declarations
    /// POST: /submit-declaration
    /// POST: /submit-payment-info
    /// </summary>
    /// <param name="endpoints">Endpoints group to map STI endpoints under</param>
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