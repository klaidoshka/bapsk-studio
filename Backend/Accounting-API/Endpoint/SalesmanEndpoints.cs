using Accounting.API.Configuration;
using Accounting.API.Util;
using Accounting.Contract.Dto.Salesman;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class SalesmanEndpoints
{
    public static void MapSalesmanEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapPost(String.Empty, Create)
            .RequireInstancePermission(InstancePermission.Customer.Create);

        builder
            .MapDelete("{id:int}", Delete)
            .RequireInstancePermission(InstancePermission.Customer.Delete);

        builder
            .MapPut("{id:int}", Edit)
            .RequireInstancePermission(InstancePermission.Customer.Edit);

        builder
            .MapGet(String.Empty, GetByInstanceId)
            .RequireInstancePermission(InstancePermission.Customer.Preview);

        builder
            .MapGet("{id:int}", GetById)
            .RequireInstancePermission(InstancePermission.Customer.Preview);
    }

    private static async Task<IResult> Create(
        [FromBody] SalesmanCreateRequest request,
        ISalesmanService salesmanService
    ) => Results.Json((await salesmanService.CreateAsync(request)).ToDto());

    private static async Task<IResult> Delete(
        int id,
        ISalesmanService salesmanService
    )
    {
        await salesmanService.DeleteAsync(new SalesmanDeleteRequest { SalesmanId = id });

        return Results.Ok();
    }

    private static async Task<IResult> Edit(
        int id,
        [FromBody] SalesmanEditRequest request,
        ISalesmanService salesmanService
    )
    {
        request.Salesman.Id = id;
        await salesmanService.EditAsync(request);

        return Results.Ok();
    }

    private static async Task<IResult> GetByInstanceId(
        int instanceId,
        HttpContext httpContext,
        ISalesmanService salesmanService
    ) => Results.Json(
        (await salesmanService.GetAsync(
            new SalesmanGetRequest
            {
                InstanceId = instanceId,
                RequesterId = httpContext.GetUserId()
            }
        ))
        .Select(it => it.ToDto())
        .ToList()
    );

    private static async Task<IResult> GetById(
        int id,
        ISalesmanService salesmanService
    ) => Results.Json((await salesmanService.GetByIdAsync(id)).ToDto());
}