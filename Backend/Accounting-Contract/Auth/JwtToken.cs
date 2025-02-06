namespace Accounting.Contract.Auth;

public class JwtToken
{
    /// <summary>
    /// Access token value.
    /// </summary>
    public required string AccessToken { get; set; }

    /// <summary>
    /// Refresh token value.
    /// </summary>
    public required string RefreshToken { get; set; }

    /// <summary>
    /// Session identifier for the token.
    /// </summary>
    public required Guid SessionId { get; set; }
}