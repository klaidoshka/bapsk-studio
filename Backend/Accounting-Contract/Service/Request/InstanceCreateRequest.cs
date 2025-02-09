namespace Accounting.Contract.Service.Request;

public class InstanceCreateRequest
{
    public int CreatorId { get; set; }
    public string? Description { get; set; }
    public string Name { get; set; }
}