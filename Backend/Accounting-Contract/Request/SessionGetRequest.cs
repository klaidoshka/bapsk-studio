namespace Accounting.Contract.Request;

public class SessionGetRequest
{
    public Guid SessionId { get; set; }
    public int? RequesterId { get; set; }
}