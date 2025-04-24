using Accounting.Contract.Dto.Auth;

namespace Accounting.API.Util;

public static class AuthHttpExtensions
{
    private const string RefreshTokenCookieName = "__accounting_refreshToken__";

    public static void ClearJwt(this HttpResponse response)
    {
        response.Cookies.Delete(RefreshTokenCookieName);
    }

    public static void PutJwt(this HttpResponse response, JwtTokenPair token)
    {
        response.Cookies.Append(
            RefreshTokenCookieName,
            token.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Lax,
                Secure = true
            }
        );
    }

    public static string? ToRefreshToken(this HttpRequest request)
    {
        return request.Cookies[RefreshTokenCookieName];
    }
}