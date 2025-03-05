namespace Accounting.Contract.Request;

public class AuthRequestUserMeta
{
    /// <summary>
    /// Agent used to log in.
    /// </summary>
    public required string? Agent { get; set; }

    /// <summary>
    /// Ip address used to log in.
    /// </summary>
    public required string? IpAddress { get; set; }

    /// <summary>
    /// Location used to log in.
    /// </summary>
    public required string? Location { get; set; }
}