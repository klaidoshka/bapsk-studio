namespace Accounting.Contract.Request;

public class InstanceDeleteRequest
{
    public int InstanceId { get; set; }
    public int? RequesterId { get; set; }
}