namespace Accounting.Contract.Request;

public class InstanceUserMetaGetByInstanceRequest
{
    public int InstanceId { get; set; }
    public int? RequesterId { get; set; }
}