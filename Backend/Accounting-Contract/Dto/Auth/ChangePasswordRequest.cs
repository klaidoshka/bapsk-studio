namespace Accounting.Contract.Dto.Auth;

public class ChangePasswordRequest
{
    public string? CurrentPassword { get; set; }
    public string Password { get; set; }
    public int? RequesterId { get; set; }
    public string? ResetPasswordToken { get; set; }
}