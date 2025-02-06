using Accounting.Contract.Entity;

namespace Accounting.Contract.Service;

public interface IJwtService
{
    /// <summary>
    /// Extracts the session id from the specified token.
    /// </summary>
    /// <param name="token">Token to extract session id from</param>
    /// <returns>Session id or null if not found, token is invalid, etc.</returns>
    public Guid? ExtractSessionId(string token);

    /// <summary>
    /// Generates a JWT access token for the specified user and session id.
    /// </summary>
    /// <param name="user">User to generate token for</param>
    /// <param name="sessionId">Session id to generate token for</param>
    /// <returns>Access token</returns>
    public string GenerateAccessToken(User user, Guid sessionId);

    /// <summary>
    /// Generates a JWT refresh token for the specified user and session id.
    /// </summary>
    /// <param name="user">User to generate token for</param>
    /// <param name="sessionId">Session id to generate token for</param>
    /// <returns>Refresh token</returns>
    public string GenerateRefreshToken(User user, Guid sessionId);
}