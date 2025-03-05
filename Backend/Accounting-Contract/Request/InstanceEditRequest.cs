namespace Accounting.Contract.Request;

public class InstanceEditRequest
{
    public string? Description { get; set; }
    public int InstanceId { get; set; }
    public string Name { get; set; }
    public int? RequesterId { get; set; }
}