namespace Accounting.Contract.Request;

public class UserGetRequest
{
    public int RequesterId { get; set; }
    public bool ReturnIdentityOnly { get; set; }
}