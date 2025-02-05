namespace Accounting.Services.Auth;

public class JwtToken
{
    public required string Token { get; set; }
    public required DateTime ExpiresAt { get; set; }
    public required Guid SessionId { get; set; }
}