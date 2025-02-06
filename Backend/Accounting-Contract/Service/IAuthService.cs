using Accounting.Contract.Auth;
using Accounting.Contract.Result;

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

    /// <summary>
    /// Checks if specified login request is valid.
    /// </summary>
    /// <param name="request">Request to validate</param>
    /// <returns>Validation instance with possible failures, if none, means it is valid</returns>
    Validation ValidateLoginRequest(LoginRequest request);

    /// <summary>
    /// Checks if specified register request is valid.
    /// </summary>
    /// <param name="request">Request to validate</param>
    /// <returns>Validation instance with possible failures, if none, means it is valid</returns>
    Task<Validation> ValidateRegisterRequestAsync(RegisterRequest request);

    /// <summary>
    /// Checks if specified token is valid.
    /// </summary>
    /// <param name="refreshToken">Token to validate</param>
    /// <returns>In-progress task that resolves into validation instance</returns>
    Task<Validation> ValidateRefreshTokenAsync(string refreshToken);

    /// <summary>
    /// Validates user credentials.
    /// </summary>
    /// <param name="email">Email used to log in</param>
    /// <param name="password">Password used to log in</param>
    /// <returns>In-progress task that resolves into validation instance</returns>
    Task<Validation> ValidateUserCredentialsAsync(string email, string password);
}