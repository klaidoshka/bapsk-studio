using System.Text.Json;
using Accounting.Contract.Request;
using Accounting.Contract.Service;

namespace Accounting.API.Util;

public static class HttpRequestExtensions
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

    public static async Task<int> GetUserIdAsync(this HttpRequest request, IJwtService jwtService)
    {
        var accessToken = request.ToAccessToken()!;
        var session = await jwtService.ExtractSessionAsync(accessToken);

        if (session == null)
        {
            throw new UnauthorizedAccessException("Invalid access token.");
        }

        return session.UserId;
    }
}