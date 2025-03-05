using Accounting.Contract.Dto;

namespace Accounting.Contract.Response;

public class AuthResponse
{
    /// <summary>
    /// Access token for the user to use in the future.
    /// </summary>
    public string AccessToken { get; set; }

    /// <summary>
    /// User information.
    /// </summary>
    public User User { get; set; }
}