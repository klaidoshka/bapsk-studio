namespace Accounting.Contract.Dto.User;

public class UserGetRequest
{
    public int RequesterId { get; set; }
    public bool ReturnIdentityOnly { get; set; }
}