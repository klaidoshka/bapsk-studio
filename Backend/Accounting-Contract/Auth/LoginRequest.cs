namespace Accounting.Contract.Auth;

public class LoginRequest
{
    /// <summary>
    /// Agent used to log in.
    /// </summary>
    public required string Agent { get; set; }

    /// <summary>
    /// Email used to log in.
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// Ip address used to log in.
    /// </summary>
    public required string IpAddress { get; set; }

    /// <summary>
    /// Location used to log in.
    /// </summary>
    public required string Location { get; set; }

    /// <summary>
    /// Password used to log in.
    /// </summary>
    public required string Password { get; set; }
}