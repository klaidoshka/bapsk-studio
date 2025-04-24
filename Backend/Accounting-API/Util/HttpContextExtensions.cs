using System.Text.Json;
using Accounting.API.Configuration;

namespace Accounting.API.Util;

public static class HttpContextExtensions
{
    /// Also caches the value in the context items upon first access.
    /// In case of Post, Put, or Patch requests, it will cache the entire request body under the key "json_{key}".
    public static async Task<object?> FindValueAsync(this HttpContext context, string key)
    {
        if (String.IsNullOrEmpty(key))
        {
            return null;
        }

        if (context.Items.TryGetValue(key, out var itemValue))
        {
            return itemValue;
        }

        if (context.Request.RouteValues.TryGetValue(key, out var routeValue))
        {
            context.Items.Add(key, routeValue);

            return routeValue;
        }

        if (context.Request.Query.TryGetValue(key, out var queryValue))
        {
            context.Items.Add(key, queryValue);

            return queryValue.ToString();
        }

        if (context.Request.HasFormContentType && context.Request.Form.TryGetValue(key, out var formValue))
        {
            context.Items.Add(key, formValue.ToString());

            return formValue.ToString();
        }

        if (
            context.Request.Method != HttpMethods.Post &&
            context.Request.Method != HttpMethods.Put &&
            context.Request.Method != HttpMethods.Patch
        )
        {
            return null;
        }

        try
        {
            return await FindValueInRequestBodyAsync(context, key);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);

            return null;
        }
    }

    private static async Task<object?> FindValueInRequestBodyAsync(HttpContext context, string key)
    {
        JsonElement? element;

        if (!context.Items.TryGetValue($"json_{key}", out var jsonBody))
        {
            context.Request.Body.Position = 0;

            element = await context.Request.ReadFromJsonAsync<JsonElement>();

            context.Items[$"json_{key}"] = element;
        }
        else
        {
            element = jsonBody as JsonElement?;
        }

        if (element is null)
        {
            return null;
        }

        var subKeys = key.Split('.');
        var currentElement = element.Value;

        foreach (var subKey in subKeys)
        {
            var propertyFound = false;

            foreach (
                var property in currentElement
                    .EnumerateObject()
                    .Where(property => property.Name.Equals(subKey, StringComparison.OrdinalIgnoreCase))
            )
            {
                currentElement = property.Value;
                propertyFound = true;

                break;
            }

            if (!propertyFound)
            {
                return null;
            }
        }

        return currentElement.ValueKind switch
        {
            JsonValueKind.String => currentElement.GetString(),
            JsonValueKind.Number => currentElement.GetDecimal(),
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.Null => null,
            JsonValueKind.Undefined => null,
            _ => currentElement.ToString()
        };
    }

    public static int GetInstanceId(this HttpContext httpContext)
    {
        return httpContext.GetInstanceIdOrNull() ?? throw new BadHttpRequestException("Missing instance id.");
    }

    public static int? GetInstanceIdOrNull(this HttpContext httpContext)
    {
        return httpContext.Items.TryGetValue(HttpContextItem.InstanceId, out var instanceId)
            ? (int?)instanceId
            : null;
    }

    public static int GetUserId(this HttpContext httpContext)
    {
        return httpContext.GetUserIdOrNull() ?? throw new UnauthorizedAccessException();
    }

    public static int? GetUserIdOrNull(this HttpContext httpContext)
    {
        return httpContext.Items.TryGetValue(HttpContextItem.UserId, out var userId)
            ? (int?)userId
            : null;
    }
}