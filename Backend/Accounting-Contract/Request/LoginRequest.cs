namespace Accounting.Contract.Request;

public class LoginRequest
{
    /// <summary>
    /// Email used to log in.
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// Log in's user's meta
    /// </summary>
    public AuthRequestUserMeta? Meta { get; set; }

    /// <summary>
    /// Password used to log in.
    /// </summary>
    public required string Password { get; set; }
}