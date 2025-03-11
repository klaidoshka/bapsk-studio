namespace Accounting.Contract.Dto.Session;

public class SessionDeleteRequest
{
    public int RequesterId { get; set; }
    public Guid SessionId { get; set; }
}