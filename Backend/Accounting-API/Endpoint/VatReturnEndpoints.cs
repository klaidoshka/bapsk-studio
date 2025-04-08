using Accounting.API.AuthorizationHandler.Requirement;
using Accounting.API.Util;
using Accounting.Contract.Dto.Sti.VatReturn;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class VatReturnEndpoints
{
    public static void MapVatReturnEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapPost(
                String.Empty,
                async (
                    [FromBody] StiVatReturnDeclarationSubmitRequest request,
                    HttpContext httpContext,
                    IVatReturnService vatReturnService
                ) =>
                {
                    request.RequesterId = httpContext.GetUserIdOrThrow();

                    return Results.Json((await vatReturnService.SubmitAsync(request)).ToDto());
                }
            )
            .RequireAuthorization(
                it => it.AddRequirements(new VatReturnRequirement(VatReturnRequirement.CrudOperation.Create))
            );

        builder
            .MapPost(
                "/{saleId:int}/cancel",
                async (
                    int saleId,
                    IVatReturnService vatReturnService
                ) =>
                {
                    await vatReturnService.CancelAsync(saleId);

                    return Results.Ok();
                }
            )
            .RequireAuthorization(
                it => it.AddRequirements(new VatReturnRequirement(VatReturnRequirement.CrudOperation.Cancel))
            );

        builder
            .MapGet(
                "{saleId:int}",
                async (
                    int saleId,
                    IVatReturnService vatReturnService
                ) => Results.Json((await vatReturnService.GetBySaleIdAsync(saleId))?.ToDto())
            )
            .RequireAuthorization(
                o => o.AddRequirements(new VatReturnRequirement(VatReturnRequirement.CrudOperation.GetBySaleId))
            );

        builder
            .MapPost(
                "/{saleId:int}/update",
                async (
                    int saleId,
                    IVatReturnService vatReturnService
                ) =>
                {
                    await vatReturnService.UpdateInfoAsync(
                        new StiVatReturnDeclarationUpdateInfoRequest
                        {
                            SaleId = saleId
                        }
                    );

                    return Results.Ok();
                }
            )
            .RequireAuthorization(
                o => o.AddRequirements(new VatReturnRequirement(VatReturnRequirement.CrudOperation.UpdateInfo))
            );

        builder
            .MapGet(
                String.Empty,
                async (
                    string code,
                    IVatReturnService vatReturnService
                ) => Results.Json((await vatReturnService.GetByPreviewCodeAsync(code))?.ToDtoWithSale())
            )
            .AllowAnonymous();

        builder
            .MapPost(
                "/update",
                async (
                    string code,
                    IVatReturnService vatReturnService
                ) =>
                {
                    await vatReturnService.UpdateInfoAsync(
                        new StiVatReturnDeclarationUpdateInfoRequest
                        {
                            PreviewCode = code
                        }
                    );

                    return Results.Ok();
                }
            )
            .AllowAnonymous();
    }
}