namespace Accounting.Contract.Dto.Session;

public class SessionGetRequest
{
    public Guid SessionId { get; set; }
    public int RequesterId { get; set; }
}