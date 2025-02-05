namespace Accounting.Services.Auth;

public class LoginRequest
{
    public required string Agent { get; set; }
    public required string Email { get; set; }
    public required string IpAddress { get; set; }
    public required string Location { get; set; }
    public required string Password { get; set; }
}