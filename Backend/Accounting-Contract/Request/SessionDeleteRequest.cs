namespace Accounting.Contract.Request;

public class SessionDeleteRequest
{
    public int RequesterId { get; set; }
    public Guid SessionId { get; set; }
}