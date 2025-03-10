namespace Accounting.Contract.Request.Instance;

public class InstanceGetRequest
{
    public int InstanceId { get; set; }
    public int? RequesterId { get; set; }
}