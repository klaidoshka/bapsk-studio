using Accounting.Contract.Sti;
using Accounting.Contract.Sti.Data;

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
            async (CancelDeclarationRequest request, IStiService stiService) =>
            {
                var response = await stiService.CancelDeclarationAsync(request);

                return response;
            }
        );

        endpoints.MapGet(
            "/exported-goods",
            async (ExportedGoodsRequest request, IStiService stiService) =>
            {
                var response = await stiService.GetInfoOnExportedGoodsAsync(request);

                return response;
            }
        );

        endpoints.MapGet(
            "/query-declarations",
            async (QueryDeclarationsRequest request, IStiService stiService) =>
            {
                var response = await stiService.QueryDeclarationsAsync(request);

                return response;
            }
        );

        endpoints.MapPost(
            "/submit-declaration",
            async (SubmitDeclarationRequest request, IStiService stiService) =>
            {
                var response = await stiService.SubmitDeclarationAsync(request);

                return response;
            }
        );

        endpoints.MapPost(
            "/submit-payment-info",
            async (SubmitPaymentInfoRequest request, IStiService stiService) =>
            {
                var response = await stiService.SubmitPaymentInfoAsync(request);

                return response;
            }
        );
    }
}