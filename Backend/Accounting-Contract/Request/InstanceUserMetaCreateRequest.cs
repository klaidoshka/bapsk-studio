namespace Accounting.Contract.Request;

public class InstanceUserMetaCreateRequest
{
    public int InstanceId { get; set; }
    public int RequesterId { get; set; }
    public int UserId { get; set; }
}