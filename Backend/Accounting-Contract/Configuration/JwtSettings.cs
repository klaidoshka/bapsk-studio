namespace Accounting.Contract.Configuration;

/// <summary>
/// Configuration for JWT token.
/// </summary>
public class JwtSettings
{
    /// <summary>
    /// When the access token expires.
    /// </summary>
    public int AccessTokenExpiryMinutes { get; set; }

    /// <summary>
    /// Audience of the JWT token. If it changes, token is invalid.
    /// </summary>
    public string Audience { get; set; }

    /// <summary>
    /// Issuer of the JWT token. If it changes, token is invalid.
    /// </summary>
    public string Issuer { get; set; }

    /// <summary>
    /// Secret key for JWT token.
    /// </summary>
    public string Secret { get; set; }
}