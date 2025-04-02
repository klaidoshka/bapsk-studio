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

        builder
            .MapPost(
                "update-trade/{tradeId:int}",
                async (
                    int tradeId,
                    IVatReturnService vatReturnService
                ) =>
                {
                    await vatReturnService.UpdateButentaTradeAsync(tradeId);

                    return Results.Ok();
                }
            );

        builder.MapGet(
                "trade-declaration/{tradeId:int}",
                async (
                    int tradeId,
                    IButentaService butentaService
                ) => Results.Json(await butentaService.GetVatReturnDeclarationByTradeId(tradeId))
            )
            .AllowAnonymous();
    }
}