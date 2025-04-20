using Accounting.API.AuthorizationHandler.Requirement;
using Accounting.API.Util;
using Accounting.Contract.Dto.Customer;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class CustomerEndpoints
{
    public static void MapCustomerEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapPost(String.Empty, Create)
            .RequireAuthorization(o =>
                o.AddRequirements(new CustomerRequirement(CustomerRequirement.CrudOperation.Create))
            );

        builder
            .MapDelete("{id:int}", Delete)
            .RequireAuthorization(o =>
                o.AddRequirements(new CustomerRequirement(CustomerRequirement.CrudOperation.Delete))
            );

        builder
            .MapPut("{id:int}", Edit)
            .RequireAuthorization(o =>
                o.AddRequirements(new CustomerRequirement(CustomerRequirement.CrudOperation.Edit))
            );

        builder
            .MapGet(String.Empty, GetByInstanceId)
            .RequireAuthorization(o =>
                o.AddRequirements(new CustomerRequirement(CustomerRequirement.CrudOperation.Get))
            );

        builder
            .MapGet("{id:int}", GetById)
            .RequireAuthorization(o =>
                o.AddRequirements(new CustomerRequirement(CustomerRequirement.CrudOperation.GetById))
            );
    }

    private static async Task<IResult> Create(
        [FromBody] CustomerCreateRequest request,
        ICustomerService customerService
    ) => Results.Json((await customerService.CreateAsync(request)).ToDto());

    private static async Task<IResult> Delete(
        int id,
        ICustomerService customerService
    )
    {
        await customerService.DeleteAsync(new CustomerDeleteRequest { CustomerId = id });

        return Results.Ok();
    }

    private static async Task<IResult> Edit(
        int id,
        [FromBody] CustomerEditRequest request,
        ICustomerService customerService
    )
    {
        request.Customer.Id = id;
        await customerService.EditAsync(request);

        return Results.Ok();
    }

    private static async Task<IResult> GetByInstanceId(
        int instanceId,
        HttpContext httpContext,
        ICustomerService customerService
    ) => Results.Json(
        (await customerService.GetAsync(
            new CustomerGetRequest
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
        ICustomerService customerService
    ) => Results.Json((await customerService.GetByIdAsync(id)).ToDto());
}