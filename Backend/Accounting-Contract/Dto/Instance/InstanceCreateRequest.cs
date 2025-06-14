namespace Accounting.Contract.Dto.Instance;

public class InstanceCreateRequest
{
    public string? Description { get; set; }
    public string Name { get; set; }
    public int RequesterId { get; set; }
    public IList<InstanceUserCreateEdit> Users { get; set; }
}