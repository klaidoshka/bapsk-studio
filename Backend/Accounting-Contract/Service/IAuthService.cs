using Accounting.Contract.Auth;

namespace Accounting.Contract.Service;

public interface IAuthService
{
    /// <summary>
    /// Logs in user with specified credentials.
    /// </summary>
    /// <param name="request">Request to use for login</param>
    /// <returns>In-progress task that resolves into JwtToken</returns>
    Task<JwtTokenPair> LoginAsync(LoginRequest request);

    /// <summary>
    /// Logs out user with specified session id.
    /// </summary>
    /// <param name="sessionId">Session id to log out</param>
    /// <returns>In-progress task that logs out specified session</returns>
    Task LogoutAsync(Guid sessionId);

    /// <summary>
    /// Refreshes the access token using a valid refresh token
    /// </summary>
    /// <param name="refreshToken">Refresh token to use for generating a new access token</param>
    /// <returns>In-progress task that resolves into a new JwtToken</returns>
    Task<JwtTokenPair> RefreshTokenAsync(string refreshToken);

    /// <summary>
    /// Registers and logs in user with specified credentials.
    /// </summary>
    /// <param name="request">Request to use for registration</param>
    /// <returns>In-progress task that resolves into JwtToken</returns>
    Task<JwtTokenPair> RegisterAsync(RegisterRequest request);
}