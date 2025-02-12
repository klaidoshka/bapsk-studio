using Accounting.Contract.Dto;
using Accounting.Contract.Request;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            string.Empty,
            async (
                [FromBody] UserCreateRequest request,
                IUserService userService
            ) => Results.Json((await userService.CreateAsync(request)).ToDto())
        );

        builder.MapDelete(
            "{id:int}",
            async (
                int id,
                IUserService userService
            ) =>
            {
                await userService.DeleteAsync(id);

                return Results.Ok();
            }
        );

        builder.MapPut(
            "{id:int}",
            async (
                int id,
                [FromBody] UserEditRequest request,
                IUserService userService
            ) =>
            {
                request.Id = id;

                await userService.EditAsync(request);

                return Results.Ok();
            }
        );

        builder.MapGet(
            "{id:int}",
            async (
                int id,
                IUserService userService
            ) => Results.Json((await userService.GetAsync(id)).ToDto())
        );

        builder.MapGet(
            string.Empty,
            async (
                string email,
                IUserService userService
            ) => Results.Json((await userService.GetByEmailAsync(email)).ToDto())
        );
    }
}