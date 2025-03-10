namespace Accounting.Contract.Request.Instance;

public class InstanceDeleteRequest
{
    public int InstanceId { get; set; }
    public int? RequesterId { get; set; }
}