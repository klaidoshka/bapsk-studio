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
    }
}