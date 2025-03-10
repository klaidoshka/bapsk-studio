using System.Text.Json;
using Accounting.API.Middleware;
using Accounting.Contract.Request;
using Accounting.Contract.Service;

namespace Accounting.API.Util;

public static class HttpContextExtensions
{
    private class HttpLocationResponse
    {
        public string? City { get; set; } = String.Empty;
        public string? Country { get; set; } = String.Empty;
        public string? Region { get; set; } = String.Empty;
    }

    public static string? GetUserAgent(this HttpRequest request)
    {
        return request.Headers["User-Agent"].ToString();
    }

    public static string? GetIpAddress(this HttpRequest request)
    {
        return request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? String.Empty;
    }

    public static async Task<string> GetLocationAsync(this HttpRequest request)
    {
        var ip = request.GetIpAddress();

        if (String.IsNullOrEmpty(ip))
        {
            return "Unknown";
        }

        using var httpClient = new HttpClient();
        var response = await httpClient.GetStringAsync($"https://ipinfo.io/{ip}/json");
        var location = JsonSerializer.Deserialize<HttpLocationResponse>(response);

        return location == null
            ? "Unknown"
            : $"{location.City} ({location.Country} - {location.Region})";
    }

    public static async Task<AuthRequestUserMeta> GetAuthRequestUserMetaAsync(
        this HttpRequest request
    )
    {
        var agent = request.GetUserAgent();
        var ipAddress = request.GetIpAddress();
        var location = await request.GetLocationAsync();

        return new AuthRequestUserMeta
        {
            Agent = agent,
            IpAddress = ipAddress,
            Location = location
        };
    }

    /// <summary>
    /// Tries to resolve the requested id from the HTTP request. I.e. `/users/1` would return 1.
    /// </summary>
    /// <returns>Requested id or null if not found</returns>
    public static int? GetRequestedId(this HttpContext context)
    {
        return context.GetRouteData().Values.TryGetValue("id", out var idValue)
            ? Int32.TryParse(idValue?.ToString(), out var userId)
                ? userId
                : null
            : null;
    }

    /// <summary>
    /// Resolves user ID from the HTTP request.
    /// </summary>
    /// <returns>User id</returns>
    /// <exception cref="UnauthorizedAccessException">Thrown if resolved id is null</exception>
    public static async Task<int> GetUserIdAsync(this HttpRequest request, IJwtService jwtService)
    {
        var accessToken = request.ToAccessToken()!;
        var session = await jwtService.ExtractSessionAsync(accessToken);

        if (session == null)
        {
            throw new UnauthorizedAccessException();
        }

        return session.UserId;
    }

    /// <summary>
    /// Resolves user ID from the HTTP context.
    /// </summary>
    /// <returns>User id or null if it was not possible to resolve</returns>
    public static int? GetUserId(this HttpContext httpContext)
    {
        return httpContext.Items.TryGetValue(UserIdExtractorMiddleware.UserIdKey, out var userId)
            ? (int?)userId
            : null;
    }

    /// <summary>
    /// Resolves user ID from the HTTP context.
    /// </summary>
    /// <returns>User id</returns>
    /// <exception cref="UnauthorizedAccessException">Thrown if user cannot be resolved</exception>
    public static int GetUserIdOrThrow(this HttpContext httpContext)
    {
        return httpContext.GetUserId() ?? throw new UnauthorizedAccessException();
    }
}