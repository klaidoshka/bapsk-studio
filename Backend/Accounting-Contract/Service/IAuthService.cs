using Accounting.Services.Auth;

namespace Accounting.Contract.Sti;

public interface IAuthService
{
    /// <summary>
    /// Logs in user with specified credentials.
    /// </summary>
    /// <param name="request">Request to use for login</param>
    /// <returns>In-progress task that resolves into JwtToken</returns>
    Task<JwtToken> LoginAsync(LoginRequest request);

    /// <summary>
    /// Logs out user with specified session id.
    /// </summary>
    /// <param name="sessionId">Session id to log out</param>
    /// <returns>In-progress task that logs out specified session</returns>
    Task LogoutAsync(Guid sessionId);

    /// <summary>
    /// Checks if specified token is valid.
    /// </summary>
    /// <param name="token">Token to validate</param>
    /// <returns>In-progress task that resolves into true/false, where true : token is valid</returns>
    Task<bool> ValidateTokenAsync(string token);

    /// <summary>
    /// Validates user credentials.
    /// </summary>
    /// <param name="email">Email used to log in</param>
    /// <param name="password">Password used to log in</param>
    /// <returns>In-progress task that resolves into true/false, where true : credentials are valid</returns>
    Task<bool> ValidateUserCredentialsAsync(string email, string password);
}