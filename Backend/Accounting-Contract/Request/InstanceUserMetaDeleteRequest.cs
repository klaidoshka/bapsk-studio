namespace Accounting.Contract.Request;

public class InstanceUserMetaDeleteRequest
{
    public int InstanceUserMetaId { get; set; }
    public int? RequesterId { get; set; }
}