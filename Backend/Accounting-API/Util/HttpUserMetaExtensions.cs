using System.Text.Json;
using Accounting.Contract.Dto.Auth;

namespace Accounting.API.Util;

public static class HttpUserMetaExtensions
{
    private class HttpLocationResponse
    {
        public string? City { get; set; } = String.Empty;
        public string? Country { get; set; } = String.Empty;
        public string? Region { get; set; } = String.Empty;
    }

    public static async Task<AuthUserMeta> GetAuthRequestUserMetaAsync(this HttpRequest request)
    {
        var agent = request.Headers.UserAgent.ToString();
        var ipAddress = request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? String.Empty;
        var location = await GetLocationAsync(request);

        return new AuthUserMeta
        {
            Agent = agent,
            IpAddress = ipAddress,
            Location = location
        };
    }

    private static async Task<string> GetLocationAsync(HttpRequest request)
    {
        var ip = request.HttpContext.Connection.RemoteIpAddress?.ToString();

        if (String.IsNullOrEmpty(ip))
        {
            return "Unknown";
        }

        using var httpClient = new HttpClient();
        var response = await httpClient.GetStringAsync($"https://ipinfo.io/{ip}/json");
        var location = JsonSerializer.Deserialize<HttpLocationResponse>(response);

        return location is null
            ? "Unknown"
            : $"{location.City} ({location.Country} - {location.Region})";
    }
}