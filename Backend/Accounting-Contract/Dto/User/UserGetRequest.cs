namespace Accounting.Contract.Dto.User;

public class UserGetRequest
{
    public string? Email { get; set; }
    public int RequesterId { get; set; }
    public bool ReturnIdentityOnly { get; set; }
}