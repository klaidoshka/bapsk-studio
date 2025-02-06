using Accounting.Contract.Enumeration;

namespace Accounting.Contract.Auth;

public class RegisterRequest
{
    /// <summary>
    /// Agent used to log in.
    /// </summary>
    public required string Agent { get; set; }

    /// <summary>
    /// Birthdate of the user
    /// </summary>
    public required DateTime BirthDate { get; set; }

    /// <summary>
    /// Country of the user
    /// </summary>
    public required IsoCountryCode Country { get; set; }

    /// <summary>
    /// Email of the user
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// First name of the user
    /// </summary>
    public required string FirstName { get; set; }

    /// <summary>
    /// Ip address used to log in.
    /// </summary>
    public required string IpAddress { get; set; }

    /// <summary>
    /// Last name of the user
    /// </summary>
    public required string LastName { get; set; }

    /// <summary>
    /// Location used to log in.
    /// </summary>
    public required string Location { get; set; }

    /// <summary>
    /// Password of the user
    /// </summary>
    public required string Password { get; set; }
}