namespace Accounting.Contract.Request;

public class InstanceGetRequest
{
    public int InstanceId { get; set; }
    public int? RequesterId { get; set; }
}