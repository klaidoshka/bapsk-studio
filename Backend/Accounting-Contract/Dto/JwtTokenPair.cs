namespace Accounting.Contract.Dto;

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

    /// <summary>
    /// When the refresh token expires.
    /// </summary>
    public required DateTime RefreshTokenExpiresAt { get; set; }

    /// <summary>
    /// User associated with the token.
    /// </summary>
    public required Entity.User User { get; set; }
}