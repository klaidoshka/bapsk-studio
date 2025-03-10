namespace Accounting.Contract.Request;

public class UserGetByEmailRequest
{
    public string Email { get; set; }
    public bool ReturnIdentityOnly { get; set; }
}