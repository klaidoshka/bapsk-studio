using Accounting.API.Util;
using Accounting.Contract.Dto.Auth;
using Accounting.Contract.Service;
using Microsoft.AspNetCore.Mvc;

namespace Accounting.API.Endpoint;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this RouteGroupBuilder builder)
    {
        builder.MapPost("/login", Login);
        builder.MapPost("/change-password", ChangePassword);
        builder.MapPost("/reset-password", ResetPassword);

        builder
            .MapPost("/logout", Logout)
            .RequireAuthorization();

        builder.MapPost("/refresh", Refresh);
        builder.MapPost("/register", Register);
    }

    private static async Task<IResult> Login(
        [FromBody] LoginRequest request,
        HttpRequest httpRequest,
        HttpResponse response,
        IAuthService authService
    )
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

    private static async Task<IResult> ChangePassword(
        [FromBody] ChangePasswordRequest request,
        HttpContext httpContext,
        IAuthService authService
    )
    {
        if (String.IsNullOrWhiteSpace(request.ResetPasswordToken))
        {
            request.RequesterId = httpContext.GetUserIdOrThrow();
        }

        await authService.ChangePasswordAsync(request);

        return Results.Ok();
    }

    private static async Task<IResult> ResetPassword(
        [FromBody] ResetPasswordRequest request,
        IAuthService authService
    )
    {
        await authService.ResetPasswordAsync(request);

        return Results.Ok();
    }

    private static async Task<IResult> Logout(
        HttpContext httpContext,
        IAuthService authService,
        IJwtService jwtService
    )
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

    private static async Task<IResult> Refresh(
        HttpContext httpContext,
        IAuthService authService
    )
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

    private static async Task<IResult> Register(
        [FromBody] RegisterRequest request,
        HttpRequest httpRequest,
        HttpResponse response,
        IAuthService authService
    )
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
}