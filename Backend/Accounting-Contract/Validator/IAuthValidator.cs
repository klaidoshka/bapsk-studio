using Accounting.Contract.Request;
using Accounting.Contract.Response;

namespace Accounting.Contract.Validator;

public interface IAuthValidator
{
    /// <summary>
    /// Checks if specified auth meta is valid.
    /// </summary>
    /// <param name="meta">User meta for authentication</param>
    /// <returns>Validation instance with possible failures</returns>
    Validation ValidateAuthMeta(AuthRequestUserMeta meta);
    
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