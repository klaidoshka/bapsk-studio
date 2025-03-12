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
            .MapPost(
                String.Empty,
                async (
                    [FromBody] CustomerCreateRequest request,
                    ICustomerService customerService
                ) => Results.Json((await customerService.CreateAsync(request)).ToDto())
            )
            .RequireAuthorization(
                it => it.AddRequirements(new CustomerRequirement(CustomerRequirement.CrudOperation.Create))
            );

        builder
            .MapDelete(
                "{id:int}",
                async (
                    int id,
                    ICustomerService customerService
                ) =>
                {
                    await customerService.DeleteAsync(new CustomerDeleteRequest { CustomerId = id });

                    return Results.Ok();
                }
            )
            .RequireAuthorization(
                it => it.AddRequirements(new CustomerRequirement(CustomerRequirement.CrudOperation.Delete))
            );

        builder
            .MapPut(
                "{id:int}",
                async (
                    int id,
                    [FromBody] CustomerEditRequest request,
                    ICustomerService customerService
                ) =>
                {
                    request.Customer.Id = id;

                    await customerService.EditAsync(request);

                    return Results.Ok();
                }
            )
            .RequireAuthorization(
                o => o.AddRequirements(new CustomerRequirement(CustomerRequirement.CrudOperation.Edit))
            );

        builder
            .MapGet(
                String.Empty,
                async (
                    int? instanceId,
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
                )
            )
            .RequireAuthorization(
                o => o.AddRequirements(new CustomerRequirement(CustomerRequirement.CrudOperation.Get))
            );

        builder
            .MapGet(
                "{id:int}",
                async (
                    int id,
                    ICustomerService customerService
                ) => Results.Json((await customerService.GetByIdAsync(id)).ToDto())
            )
            .RequireAuthorization(
                o => o.AddRequirements(new CustomerRequirement(CustomerRequirement.CrudOperation.GetById))
            );
    }
}