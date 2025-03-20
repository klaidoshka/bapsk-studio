using Accounting.Contract.Dto.Sti.VatReturn;
using Accounting.Contract.Service;

namespace Accounting.API.Endpoint;

public static class ButentaEndpoints
{
    public static void MapButentaEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapPost(
                "submit-trade/{tradeId:int}",
                async (
                    int tradeId,
                    IVatReturnService vatReturnService
                ) =>
                {
                    var response = await vatReturnService.SubmitButentaTradeAsync(tradeId);

                    return Results.Json(response.ToDto());
                }
            )
            .AllowAnonymous();

        builder.MapGet(
                "declaration/{declarationId}",
                async (
                    string declarationId,
                    IVatReturnService vatReturnService
                ) => Results.Json(await vatReturnService.GetByIdAsync(declarationId))
            )
            .AllowAnonymous();
    }
}