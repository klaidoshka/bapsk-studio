using Accounting.Contract.Auth;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            "/login",
            async ([FromBody] LoginRequest request, HttpResponse response, IAuthService authService) =>
            {
                var validation = authService.ValidateLoginRequest(request);

                return await validation.ToResultAsync(
                    async () =>
                    {
                        var token = await authService.LoginAsync(request);

                        PutTokensIntoResponse(token, response);
                    }
                );
            }
        );

        builder
            .MapPost(
                "/logout",
                async (HttpContext httpContext, IAuthService authService, IJwtService jwtService) =>
                {
                    var refreshToken = GetRefreshTokenFromRequest(httpContext.Request);

                    var validation = await authService.ValidateRefreshTokenAsync(refreshToken);

                    return await validation.ToResultAsync(
                        async () =>
                        {
                            var sessionId = jwtService.ExtractSessionId(refreshToken)!.Value;

                            await authService.LogoutAsync(sessionId);

                            httpContext.Response.Cookies.Delete("accessToken");
                            httpContext.Response.Cookies.Delete("refreshToken");
                        }
                    );
                }
            )
            .RequireAuthorization();

        builder.MapPost(
            "/refresh",
            async (HttpContext httpContext, IAuthService authService) =>
            {
                var refreshToken = GetRefreshTokenFromRequest(httpContext.Request);

                if (string.IsNullOrWhiteSpace(refreshToken))
                {
                    return Results.Unauthorized();
                }

                var validation = await authService.ValidateRefreshTokenAsync(refreshToken);

                return await validation.ToResultAsync(
                    async () =>
                    {
                        var token = await authService.RefreshTokenAsync(refreshToken);

                        PutTokensIntoResponse(token, httpContext.Response);
                    }
                );
            }
        );

        builder.MapPost(
            "/register",
            async ([FromBody] RegisterRequest request, IAuthService authService) =>
            {
                var validation = await authService.ValidateRegisterRequestAsync(request);

                return await validation.ToResultAsync(
                    () => authService.RegisterAsync(request)
                );
            }
        );
    }

    private static string? GetRefreshTokenFromRequest(HttpRequest request)
    {
        return request.Cookies["refreshToken"];
    }

    private static void PutTokensIntoResponse(JwtTokenPair token, HttpResponse response)
    {
        response.Cookies.Append(
            "accessToken",
            token.AccessToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // TODO: Set to true when using HTTPS
                SameSite = SameSiteMode.Strict
            }
        );

        response.Cookies.Append(
            "refreshToken",
            token.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // TODO: Set to true when using HTTPS
                SameSite = SameSiteMode.Strict
            }
        );
    }
}