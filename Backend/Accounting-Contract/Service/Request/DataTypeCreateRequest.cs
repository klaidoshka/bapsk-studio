namespace Accounting.Contract.Service.Request;

public class DataTypeCreateRequest
{
    public string? Description { get; set; }
    public int InstanceId { get; set; }
    public string Name { get; set; }
}