using Accounting.API.Util;
using Accounting.Contract.Dto.ImportConfiguration;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class ImportConfigurationEndpoints
{
    public static void MapImportConfigurationEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            String.Empty,
            async (
                [FromBody] ImportConfigurationCreateRequest request,
                IImportConfigurationService importConfigurationService,
                HttpRequest httpRequest,
                IJwtService jwtService
            ) =>
            {
                request.RequesterId = await httpRequest.GetUserIdAsync(jwtService);

                return Results.Json((await importConfigurationService.CreateAsync(request)).ToDto());
            }
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IImportConfigurationService importConfigurationService,
                IJwtService jwtService,
                HttpRequest request
            ) =>
            {
                await importConfigurationService.DeleteAsync(
                    new ImportConfigurationDeleteRequest
                    {
                        ImportConfigurationId = id,
                        RequesterId = await request.GetUserIdAsync(jwtService)
                    }
                );

                return Results.Ok();
            }
        );

        builder.MapPut(
            "/{id:int}",
            async (
                int id,
                [FromBody] ImportConfigurationEditRequest request,
                IImportConfigurationService importConfigurationService,
                HttpRequest httpRequest,
                IJwtService jwtService
            ) =>
            {
                request.ImportConfiguration.Id = id;
                request.RequesterId = await httpRequest.GetUserIdAsync(jwtService);

                await importConfigurationService.EditAsync(request);

                return Results.Ok();
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IImportConfigurationService importConfigurationService,
                HttpRequest httpRequest,
                IJwtService jwtService
            ) => Results.Json(
                (await importConfigurationService.GetAsync(
                    new ImportConfigurationGetRequest
                    {
                        ImportConfigurationId = id,
                        RequesterId = await httpRequest.GetUserIdAsync(jwtService)
                    }
                )).ToDto()
            )
        );

        builder.MapGet(
            String.Empty,
            async (
                int instanceId,
                IImportConfigurationService importConfigurationService,
                HttpRequest httpRequest,
                IJwtService jwtService
            ) => Results.Json(
                (await importConfigurationService.GetAsync(
                    new ImportConfigurationGetByInstanceRequest
                    {
                        InstanceId = instanceId,
                        RequesterId = await httpRequest.GetUserIdAsync(jwtService)
                    }
                ))
                .Select(i => i.ToDto())
                .ToList()
            )
        );
    }
}