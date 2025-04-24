using Accounting.API.Configuration;
using Accounting.API.Util;
using Accounting.Contract.Dto.Sti.VatReturn;
using Accounting.Contract.Dto.Sti.VatReturn.Payment;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class VatReturnEndpoints
{
    public static void MapVatReturnEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapPost(String.Empty, Submit)
            .RequireInstancePermission(InstancePermission.VatReturn.Create)
            .RequireInstanceOwnsEntity<Sale>("saleId");

        builder
            .MapPost("/{saleId:int}/cancel", Cancel)
            .RequireInstancePermission(InstancePermission.VatReturn.Cancel)
            .RequireInstanceOwnsEntity<Sale>("saleId");

        builder
            .MapPost("/{saleId:int}/update", UpdateInfoBySaleId)
            .RequireInstancePermission(InstancePermission.VatReturn.Preview)
            .RequireInstanceOwnsEntity<Sale>("saleId");

        builder
            .MapPost("/{saleId:int}/payment", SubmitPaymentInfo)
            .RequireInstancePermission(InstancePermission.VatReturn.SubmitPayment)
            .RequireInstanceOwnsEntity<Sale>("saleId");

        builder
            .MapGet("{saleId:int}", GetBySaleId)
            .RequireInstancePermission(InstancePermission.VatReturn.Preview)
            .RequireInstanceOwnsEntity<Sale>("saleId");
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