namespace Accounting.Contract.Service.Request;

public class DataTypeCreateRequest
{
    public int CreatorId { get; set; }
    public string? Description { get; set; }
    public int InstanceId { get; set; }
    public string Name { get; set; }
}