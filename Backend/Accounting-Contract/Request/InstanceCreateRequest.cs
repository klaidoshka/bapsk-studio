namespace Accounting.Contract.Request;

public class InstanceCreateRequest
{
    public string? Description { get; set; }
    public string Name { get; set; }
    public int? RequesterId { get; set; }
}