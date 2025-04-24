using Accounting.API.Util;
using Accounting.Contract.Validator;

namespace Accounting.API.Filter;

public class InstanceOwnsEntityFilter<T> : IEndpointFilter where T : class
{
    private readonly string _entityIdArgumentName;
    private readonly bool _entityIdOptional;
    private readonly IInstanceEntityValidator<T> _validator;

    public InstanceOwnsEntityFilter(
        string entityIdArgumentName,
        bool entityIdOptional,
        IInstanceEntityValidator<T> validator
    )
    {
        _entityIdArgumentName = entityIdArgumentName;
        _entityIdOptional = entityIdOptional;
        _validator = validator;
    }

    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var entityIdAsString = (await context.HttpContext.FindValueAsync(_entityIdArgumentName))?.ToString();

        if (String.IsNullOrWhiteSpace(entityIdAsString))
        {
            if (!_entityIdOptional)
            {
                return Results.BadRequest($"Missing required argument '{_entityIdArgumentName}'.");
            }

            return await next(context);
        }

        var instanceIdAsString = (await context.HttpContext.FindValueAsync("instanceId"))?.ToString();

        if (!Int32.TryParse(instanceIdAsString, out var instanceId))
        {
            return Results.BadRequest("Invalid or missing instance id.");
        }

        var entityId = Int32.Parse(entityIdAsString);

        if (!await _validator.IsFromInstanceAsync(entityId, instanceId))
        {
            return Results.Forbid();
        }

        return await next(context);
    }
}