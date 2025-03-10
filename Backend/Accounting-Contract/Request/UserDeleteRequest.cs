namespace Accounting.Contract.Request;

public class UserDeleteRequest
{
    public int RequesterId { get; set; }
    public int UserId { get; set; }
}