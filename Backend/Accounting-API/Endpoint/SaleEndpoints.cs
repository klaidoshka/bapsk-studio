using Accounting.API.AuthorizationHandler.Requirement;
using Accounting.API.Util;
using Accounting.Contract.Dto.Sale;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class SaleEndpoints
{
    public static void MapSaleEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapPost(
                String.Empty,
                async (
                    [FromBody] SaleCreateRequest request,
                    ISaleService saleService
                ) => Results.Json((await saleService.CreateAsync(request)).ToDto())
            )
            .RequireAuthorization(
                it => it.AddRequirements(new SaleRequirement(SaleRequirement.CrudOperation.Create))
            );

        builder
            .MapDelete(
                "{id:int}",
                async (
                    int id,
                    ISaleService saleService
                ) =>
                {
                    await saleService.DeleteAsync(new SaleDeleteRequest { SaleId = id });

                    return Results.Ok();
                }
            )
            .RequireAuthorization(
                it => it.AddRequirements(new SaleRequirement(SaleRequirement.CrudOperation.Delete))
            );

        builder
            .MapPut(
                "{id:int}",
                async (
                    int id,
                    [FromBody] SaleEditRequest request,
                    ISaleService saleService
                ) =>
                {
                    request.Sale.Id = id;

                    await saleService.EditAsync(request);

                    return Results.Ok();
                }
            )
            .RequireAuthorization(
                o => o.AddRequirements(new SaleRequirement(SaleRequirement.CrudOperation.Edit))
            );

        builder
            .MapGet(
                String.Empty,
                async (
                    int instanceId,
                    HttpContext httpContext,
                    ISaleService saleService
                ) => Results.Json(
                    (await saleService.GetAsync(
                        new SaleGetRequest
                        {
                            InstanceId = instanceId,
                            RequesterId = httpContext.GetUserIdOrThrow()
                        }
                    ))
                    .Select(it => it.ToDto())
                    .ToList()
                )
            )
            .RequireAuthorization(
                o => o.AddRequirements(new SaleRequirement(SaleRequirement.CrudOperation.Get))
            );

        builder
            .MapGet(
                "{id:int}",
                async (
                    int id,
                    ISaleService saleService
                ) => Results.Json((await saleService.GetByIdAsync(id)).ToDto())
            )
            .RequireAuthorization(
                o => o.AddRequirements(new SaleRequirement(SaleRequirement.CrudOperation.GetById))
            );
    }
}