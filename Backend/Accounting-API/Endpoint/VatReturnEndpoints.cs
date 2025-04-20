using Accounting.API.AuthorizationHandler.Requirement;
using Accounting.API.Util;
using Accounting.Contract.Dto.Sti.VatReturn;
using Accounting.Contract.Dto.Sti.VatReturn.Payment;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class VatReturnEndpoints
{
    public static void MapVatReturnEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapPost(String.Empty, Submit)
            .RequireAuthorization(it => it.AddRequirements(new VatReturnRequirement(VatReturnRequirement.CrudOperation.Create)));

        builder
            .MapPost("/{saleId:int}/cancel", Cancel)
            .RequireAuthorization(it => it.AddRequirements(new VatReturnRequirement(VatReturnRequirement.CrudOperation.Cancel)));

        builder
            .MapPost("/{saleId:int}/update", UpdateInfoBySaleId)
            .RequireAuthorization(o =>
                o.AddRequirements(new VatReturnRequirement(VatReturnRequirement.CrudOperation.UpdateInfo))
            );

        builder
            .MapPost("/{saleId:int}/payment", SubmitPaymentInfo)
            .RequireAuthorization(o =>
                o.AddRequirements(new VatReturnRequirement(VatReturnRequirement.CrudOperation.SubmitPayment))
            );

        builder
            .MapGet("{saleId:int}", GetBySaleId)
            .RequireAuthorization(o =>
                o.AddRequirements(new VatReturnRequirement(VatReturnRequirement.CrudOperation.GetBySaleId))
            );

        builder
            .MapGet(String.Empty, GetByPreviewCode)
            .AllowAnonymous();

        builder
            .MapPost("/update", UpdateInfoByPreviewCode)
            .AllowAnonymous();
    }

    private static async Task<IResult> Submit(
        [FromBody] StiVatReturnDeclarationSubmitRequest request,
        HttpContext httpContext,
        IVatReturnService vatReturnService
    )
    {
        request.RequesterId = httpContext.GetUserIdOrThrow();

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

    private static async Task<IResult> GetByPreviewCode(
        string code,
        IVatReturnService vatReturnService
    ) => Results.Json((await vatReturnService.GetByPreviewCodeAsync(code))?.ToDtoWithSale());

    private static async Task<IResult> UpdateInfoByPreviewCode(
        string code,
        IVatReturnService vatReturnService
    )
    {
        await vatReturnService.UpdateInfoAsync(new StiVatReturnDeclarationUpdateInfoRequest { PreviewCode = code });

        return Results.Ok();
    }
}