using Accounting.Contract.Dto.Sti.VatReturn;
using Accounting.Contract.Service;

namespace Accounting.API.Endpoint;

public static class ButentaEndpoints
{
    public static void MapButentaEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost("submit-trade/{tradeId:int}", SubmitTrade);
        builder.MapPost("update-trade/{tradeId:int}", UpdateTrade);
        builder.MapGet("trade-declaration/{tradeId:int}", GetTradeDeclaration);
    }

    private static async Task<IResult> SubmitTrade(
        int tradeId,
        IVatReturnService vatReturnService
    )
    {
        var response = await vatReturnService.SubmitButentaTradeAsync(tradeId);

        return Results.Json(response.ToDto());
    }

    private static async Task<IResult> UpdateTrade(
        int tradeId,
        IVatReturnService vatReturnService
    )
    {
        await vatReturnService.UpdateButentaTradeAsync(tradeId);

        return Results.Ok();
    }

    private static async Task<IResult> GetTradeDeclaration(
        int tradeId,
        IButentaService butentaService
    ) => Results.Json(await butentaService.GetVatReturnDeclarationByTradeId(tradeId));
}