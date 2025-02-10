using Accounting.Contract.Service;
using Accounting.Contract.Service.Request;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class DataEntryEndpoints
{
    public static void MapDataEntryEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            string.Empty,
            async Task (
                [FromBody] DataEntryCreateRequest request,
                IDataEntryService dataEntryService
            ) => await dataEntryService.CreateAsync(request)
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IDataEntryService dataEntryService
            ) => await dataEntryService.DeleteAsync(id)
        );

        builder.MapPatch(
            "/{id:int}",
            async Task (
                int id,
                [FromBody] DataEntryEditRequest request,
                IDataEntryService dataEntryService
            ) =>
            {
                request.Id = id;

                await dataEntryService.EditAsync(request);
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IDataEntryService dataEntryService
            ) => await dataEntryService.GetAsync(id)
        );

        builder.MapGet(
            string.Empty,
            async (
                int dataTypeId,
                IDataEntryService dataEntryService
            ) => await dataEntryService.GetByDataTypeIdAsync(dataTypeId)
        );
    }

    public static void MapDataEntryFieldEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            string.Empty,
            async (
                [FromBody] DataEntryFieldCreateRequest request,
                IDataEntryFieldService dataEntryFieldService
            ) => await dataEntryFieldService.CreateAsync(request)
        );

        builder.MapDelete(
            "/{id:int}",
            async (
                int id,
                IDataEntryFieldService dataEntryFieldService
            ) => await dataEntryFieldService.DeleteAsync(id)
        );

        builder.MapPatch(
            "/{id:int}",
            async (
                int id,
                [FromBody] DataEntryFieldEditRequest request,
                IDataEntryFieldService dataEntryFieldService
            ) =>
            {
                request.Id = id;

                await dataEntryFieldService.EditAsync(request);
            }
        );

        builder.MapGet(
            "/{id:int}",
            async (
                int id,
                IDataEntryFieldService dataEntryFieldService
            ) => await dataEntryFieldService.GetAsync(id)
        );

        builder.MapGet(
            string.Empty,
            async (
                int dataEntryId,
                IDataEntryFieldService dataEntryFieldService
            ) => await dataEntryFieldService.GetByDataEntryIdAsync(dataEntryId)
        );
    }
}