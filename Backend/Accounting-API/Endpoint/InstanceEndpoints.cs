using Accounting.API.Util;
using Accounting.Contract.Service;
using Accounting.Contract.Service.Request;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class InstanceEndpoints
{
    public static void MapInstanceEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            string.Empty,
            async (
                [FromBody] InstanceCreateRequest request,
                IInstanceService instanceService
            ) => await instanceService.CreateAsync(request)
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IInstanceService instanceService
            ) => await instanceService.DeleteAsync(id)
        );

        builder.MapPatch(
            "/{id:int}",
            async (
                int id,
                [FromBody] InstanceEditRequest request,
                IInstanceService instanceService
            ) =>
            {
                request.Id = id;

                await instanceService.EditAsync(request);
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IInstanceService instanceService
            ) => await instanceService.GetAsync(id)
        );

        builder.MapGet(
            string.Empty,
            async (
                int userId,
                IInstanceService instanceService
            ) => await instanceService.GetByUserIdAsync(userId)
        );
    }

    public static void MapInstanceMetaEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            string.Empty,
            async (
                [FromBody] InstanceUserMetaCreateRequest request,
                IInstanceUserMetaService instanceUserMetaService
            ) => await instanceUserMetaService.CreateAsync(request)
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IInstanceUserMetaService instanceUserMetaService,
                IJwtService jwtService,
                HttpRequest request
            ) =>
            {
                var token = request.ToAccessToken()!;
                var session = jwtService.ExtractSession(token);

                if (session == null)
                {
                    throw new UnauthorizedAccessException("Invalid access token.");
                }

                await instanceUserMetaService.DeleteAsync(id, session.UserId);
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IInstanceUserMetaService instanceUserMetaService
            ) => await instanceUserMetaService.GetAsync(id)
        );

        builder.MapGet(
            string.Empty,
            async (
                int instanceId,
                IInstanceUserMetaService instanceUserMetaService
            ) => await instanceUserMetaService.GetByInstanceIdAsync(instanceId)
        );
    }
}