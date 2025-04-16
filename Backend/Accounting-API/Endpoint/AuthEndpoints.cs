using Accounting.API.Util;
using Accounting.Contract.Dto.Auth;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost(
            "/login",
            async (
                [FromBody] LoginRequest request,
                HttpRequest httpRequest,
                HttpResponse response,
                IAuthService authService
            ) =>
            {
                request.Meta = await httpRequest.GetAuthRequestUserMetaAsync();

                var token = await authService.LoginAsync(request);

                response.PutJwt(token);

                return Results.Ok(
                    new AuthResponse
                    {
                        AccessToken = token.AccessToken,
                        SessionId = token.SessionId,
                        UserId = token.User.Id
                    }
                );
            }
        );

        builder.MapPost(
            "/change-password",
            async (
                [FromBody] ChangePasswordRequest request,
                HttpContext httpContext,
                IAuthService authService
            ) =>
            {
                request.RequesterId = String.IsNullOrWhiteSpace(request.ResetPasswordToken) 
                    ? httpContext.GetUserIdOrThrow()
                    : httpContext.GetUserId();

                await authService.ChangePasswordAsync(request);

                return Results.Ok();
            }
        );

        builder.MapPost(
            "/reset-password",
            async (
                [FromBody] ResetPasswordRequest request,
                IAuthService authService
            ) =>
            {
                await authService.ResetPasswordAsync(request);

                return Results.Ok();
            }
        );

        builder
            .MapPost(
                "/logout",
                async (
                    HttpContext httpContext,
                    IAuthService authService,
                    IJwtService jwtService
                ) =>
                {
                    var refreshToken = httpContext.Request.ToRefreshToken();

                    if (String.IsNullOrWhiteSpace(refreshToken))
                    {
                        return Results.Unauthorized();
                    }

                    var sessionId = jwtService.ExtractSessionId(refreshToken)!.Value;

                    await authService.LogoutAsync(sessionId);

                    httpContext.Response.ClearJwt();

                    return Results.Ok();
                }
            )
            .RequireAuthorization();

        builder.MapPost(
            "/refresh",
            async (
                HttpContext httpContext,
                IAuthService authService
            ) =>
            {
                var refreshToken = httpContext.Request.ToRefreshToken();

                if (String.IsNullOrWhiteSpace(refreshToken))
                {
                    return Results.Unauthorized();
                }

                var token = await authService.RefreshTokenAsync(refreshToken);

                httpContext.Response.PutJwt(token);

                return Results.Ok(
                    new AuthResponse
                    {
                        AccessToken = token.AccessToken,
                        SessionId = token.SessionId,
                        UserId = token.User.Id
                    }
                );
            }
        );

        builder.MapPost(
            "/register",
            async (
                [FromBody] RegisterRequest request,
                HttpRequest httpRequest,
                HttpResponse response,
                IAuthService authService
            ) =>
            {
                request.Meta = await httpRequest.GetAuthRequestUserMetaAsync();

                var token = await authService.RegisterAsync(request);

                response.PutJwt(token);

                return Results.Ok(
                    new AuthResponse
                    {
                        AccessToken = token.AccessToken,
                        SessionId = token.SessionId,
                        UserId = token.User.Id
                    }
                );
            }
        );
    }
}