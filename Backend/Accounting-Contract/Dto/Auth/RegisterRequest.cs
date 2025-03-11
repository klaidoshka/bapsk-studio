using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Auth;

public class RegisterRequest
{
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
    /// Last name of the user
    /// </summary>
    public required string LastName { get; set; }

    /// <summary>
    /// Registration user's meta
    /// </summary>
    public AuthUserMeta? Meta { get; set; }

    /// <summary>
    /// Password of the user
    /// </summary>
    public required string Password { get; set; }
}