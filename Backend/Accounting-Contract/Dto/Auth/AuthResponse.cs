namespace Accounting.Contract.Dto.Auth;

public class AuthResponse
{
    /// <summary>
    /// Access token for the user to use in the future.
    /// </summary>
    public string AccessToken { get; set; }

    /// <summary>
    /// Session id for the user to use in the future.
    /// </summary>
    public Guid SessionId { get; set; }

    /// <summary>
    /// User id associated with the token.
    /// </summary>
    public int UserId { get; set; }
}