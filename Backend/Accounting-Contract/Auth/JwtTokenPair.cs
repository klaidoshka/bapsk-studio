namespace Accounting.Contract.Auth;

public class JwtTokenPair
{
    /// <summary>
    /// Access token value.
    /// </summary>
    public required string AccessToken { get; set; }

    /// <summary>
    /// Refresh token value.
    /// </summary>
    public required string RefreshToken { get; set; }
}