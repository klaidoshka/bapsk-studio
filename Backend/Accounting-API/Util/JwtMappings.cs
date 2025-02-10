using Accounting.Contract.Auth;

namespace Accounting.API.Util;

public static class JwtMappings
{
    private const string RefreshTokenCookieName = "refreshToken";

    /// <summary>
    /// Clears the JWT from the response.
    /// </summary>
    /// <param name="response">Response to clear tokens from</param>
    public static void ClearJwt(this HttpResponse response)
    {
        response.Cookies.Delete(RefreshTokenCookieName);
    }

    /// <summary>
    /// Puts the JWT into the response.
    /// </summary>
    /// <param name="response">Response to put tokens in</param>
    /// <param name="token">Jwt tokens to put into response cookies</param>
    public static void PutJwt(this HttpResponse response, JwtTokenPair token)
    {
        response.Cookies.Append(
            RefreshTokenCookieName,
            token.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // TODO: Set to true when using HTTPS
                SameSite = SameSiteMode.Strict
            }
        );
    }

    /// <summary>
    /// Extracts the access token from the request.
    /// </summary>
    /// <param name="request">Request to extract access token from</param>
    /// <returns>Access token or null if not found</returns>
    public static string? ToAccessToken(this HttpRequest request)
    {
        return request.Headers
            .Authorization
            .ToString()
            ?.Replace("Bearer ", "");
    }

    /// <summary>
    /// Extracts the refresh token from the request.
    /// </summary>
    /// <param name="request">Request to extract refresh token from</param>
    /// <returns>Refresh token or null if not found</returns>
    public static string? ToRefreshToken(this HttpRequest request)
    {
        return request.Cookies[RefreshTokenCookieName];
    }
}