using Accounting.API.Util;
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

                        response.PutJwt(token);

                        return token.AccessToken;
                    }
                );
            }
        );

        builder
            .MapPost(
                "/logout",
                async (HttpContext httpContext, IAuthService authService, IJwtService jwtService) =>
                {
                    var refreshToken = httpContext.Request.ToRefreshToken();

                    if (string.IsNullOrWhiteSpace(refreshToken))
                    {
                        return Results.Unauthorized();
                    }

                    var validation = await authService.ValidateRefreshTokenAsync(refreshToken);

                    return await validation.ToResultAsync(
                        async () =>
                        {
                            var sessionId = jwtService.ExtractSessionId(refreshToken)!.Value;

                            await authService.LogoutAsync(sessionId);

                            httpContext.Response.ClearJwt();
                        }
                    );
                }
            )
            .RequireAuthorization();

        builder.MapPost(
            "/refresh",
            async (HttpContext httpContext, IAuthService authService) =>
            {
                var refreshToken = httpContext.Request.ToRefreshToken();

                if (string.IsNullOrWhiteSpace(refreshToken))
                {
                    return Results.Unauthorized();
                }

                var validation = await authService.ValidateRefreshTokenAsync(refreshToken);

                return await validation.ToResultAsync(
                    async () =>
                    {
                        var token = await authService.RefreshTokenAsync(refreshToken);

                        httpContext.Response.PutJwt(token);

                        return token.AccessToken;
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
                    async () => (await authService.RegisterAsync(request)).AccessToken
                );
            }
        );
    }
}