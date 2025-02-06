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
            async ([FromBody] LoginRequest request, IAuthService authService) =>
            {
                var validation = authService.ValidateLoginRequest(request);

                return await validation.ToResultAsync(
                    () => authService.LoginAsync(request)
                );
            }
        );

        builder
            .MapPost(
                "/logout",
                async ([FromBody] JwtToken token, IAuthService authService, IJwtService jwtService) =>
                {
                    var validation = await authService.ValidateRefreshTokenAsync(token.RefreshToken);

                    return await validation.ToResultAsync(
                        () =>
                        {
                            var sessionId = jwtService.ExtractSessionId(token.RefreshToken)!.Value;

                            return authService.LogoutAsync(sessionId);
                        }
                    );
                }
            )
            .RequireAuthorization();

        builder.MapPost(
            "/refresh",
            async ([FromBody] JwtToken token, IAuthService authService) =>
            {
                var validation = await authService.ValidateRefreshTokenAsync(token.RefreshToken);

                return await validation.ToResultAsync(
                    () => authService.RefreshTokenAsync(token.RefreshToken)
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
}