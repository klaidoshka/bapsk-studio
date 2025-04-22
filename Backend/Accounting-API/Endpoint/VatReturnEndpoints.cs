using Accounting.API.Configuration;
using Accounting.API.Util;
using Accounting.Contract.Dto.Sti.VatReturn;
using Accounting.Contract.Dto.Sti.VatReturn.Payment;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static partial class VatReturnEndpoints
{
    public static void MapVatReturnEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapPost(String.Empty, Submit)
            .RequireInstancePermission(InstancePermission.VatReturn.Create);

        builder
            .MapPost("/{saleId:int}/cancel", Cancel)
            .RequireInstancePermission(InstancePermission.VatReturn.Cancel);

        builder
            .MapPost("/{saleId:int}/update", UpdateInfoBySaleId)
            .RequireInstancePermission(InstancePermission.VatReturn.Preview);

        builder
            .MapPost("/{saleId:int}/payment", SubmitPaymentInfo)
            .RequireInstancePermission(InstancePermission.VatReturn.SubmitPayment);

        builder
            .MapGet("{saleId:int}", GetBySaleId)
            .RequireInstancePermission(InstancePermission.VatReturn.Preview);
    }

    private static async Task<IResult> Submit(
        [FromBody] StiVatReturnDeclarationSubmitRequest request,
        HttpContext httpContext,
        IVatReturnService vatReturnService
    )
    {
        request.RequesterId = httpContext.GetUserId();

        return Results.Json((await vatReturnService.SubmitAsync(request)).ToDto());
    }

    private static async Task<IResult> Cancel(
        int saleId,
        IVatReturnService vatReturnService
    )
    {
        await vatReturnService.CancelAsync(saleId);

        return Results.Ok();
    }

    private static async Task<IResult> UpdateInfoBySaleId(
        int saleId,
        IVatReturnService vatReturnService
    )
    {
        await vatReturnService.UpdateInfoAsync(new StiVatReturnDeclarationUpdateInfoRequest { SaleId = saleId });

        return Results.Ok();
    }

    private static async Task<IResult> SubmitPaymentInfo(
        int saleId,
        [FromBody] IList<PaymentInfo> payments,
        IVatReturnService vatReturnService
    )
    {
        await vatReturnService.SubmitPaymentInfoAsync(saleId, payments);

        return Results.Ok();
    }

    private static async Task<IResult> GetBySaleId(
        int saleId,
        IVatReturnService vatReturnService
    ) => Results.Json((await vatReturnService.GetBySaleIdAsync(saleId))?.ToDto());
}