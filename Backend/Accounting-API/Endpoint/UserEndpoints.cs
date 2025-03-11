using Accounting.API.AuthorizationHandler.Requirement;
using Accounting.API.Util;
using Accounting.Contract.Configuration;
using Accounting.Contract.Dto.User;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this RouteGroupBuilder builder)
    {
        builder
            .MapPost(
                String.Empty,
                async (
                    [FromBody] UserCreateRequest request,
                    IUserService userService
                ) => Results.Json((await userService.CreateAsync(request)).ToDto())
            )
            .RequireAuthorization(Policies.AdminOnly);

        builder
            .MapDelete(
                "{id:int}",
                async (
                    int id,
                    IUserService userService
                ) =>
                {
                    await userService.DeleteAsync(id);

                    return Results.Ok();
                }
            )
            .RequireAuthorization(
                it => it.AddRequirements(new UserRequirement(UserRequirement.CrudOperation.Delete))
            );

        builder
            .MapPut(
                "{id:int}",
                async (
                    int id,
                    [FromBody] UserEditRequest request,
                    IUserService userService
                ) =>
                {
                    request.UserId = id;

                    await userService.EditAsync(request);

                    return Results.Ok();
                }
            )
            .RequireAuthorization(
                o => o.AddRequirements(new UserRequirement(UserRequirement.CrudOperation.Edit))
            );

        builder.MapGet(
            String.Empty,
            async (
                bool? returnIdentityOnly,
                HttpContext httpContext,
                IUserService userService
            ) => Results.Json(
                (await userService.GetAsync(
                    new UserGetRequest
                    {
                        RequesterId = httpContext.GetUserIdOrThrow(),
                        ReturnIdentityOnly = returnIdentityOnly ?? false
                    }
                ))
                .Select(it => (object) (returnIdentityOnly == true ? it.ToIdentityDto() : it.ToDto()))
                .ToList()
            )
        );

        builder.MapGet(
                "{id:int}",
                async (
                    int id,
                    bool? returnIdentityOnly,
                    IUserService userService
                ) =>
                {
                    var user = await userService.GetByIdAsync(id);

                    return (returnIdentityOnly ?? false)
                        ? Results.Json(user.ToIdentityDto())
                        : Results.Json(user.ToDto());
                }
            )
            .RequireAuthorization(
                it => it.AddRequirements(new UserRequirement(UserRequirement.CrudOperation.GetById))
            );
    }
}