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
            .MapPost(String.Empty, Create)
            .RequireAuthorization(it => it.AddRequirements(new SaleRequirement(SaleRequirement.CrudOperation.Create)));

        builder
            .MapDelete("{id:int}", Delete)
            .RequireAuthorization(it => it.AddRequirements(new SaleRequirement(SaleRequirement.CrudOperation.Delete)));

        builder
            .MapPut("{id:int}", Edit)
            .RequireAuthorization(o => o.AddRequirements(new SaleRequirement(SaleRequirement.CrudOperation.Edit)));

        builder
            .MapGet(String.Empty, GetByInstanceId)
            .RequireAuthorization(o => o.AddRequirements(new SaleRequirement(SaleRequirement.CrudOperation.Get)));

        builder
            .MapGet("{id:int}", GetById)
            .RequireAuthorization(o => o.AddRequirements(new SaleRequirement(SaleRequirement.CrudOperation.GetById)));
    }

    private static async Task<IResult> Create(
        [FromBody] SaleCreateRequest request,
        ISaleService saleService
    ) => Results.Json((await saleService.CreateAsync(request)).ToDto());

    private static async Task<IResult> Delete(
        int id,
        ISaleService saleService
    )
    {
        await saleService.DeleteAsync(new SaleDeleteRequest { SaleId = id });

        return Results.Ok();
    }

    private static async Task<IResult> Edit(
        int id,
        [FromBody] SaleEditRequest request,
        ISaleService saleService
    )
    {
        request.Sale.Id = id;
        await saleService.EditAsync(request);

        return Results.Ok();
    }

    private static async Task<IResult> GetByInstanceId(
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
    );

    private static async Task<IResult> GetById(
        int id,
        ISaleService saleService
    ) => Results.Json((await saleService.GetByIdAsync(id)).ToDto());
}