namespace Accounting.Contract.Request.DataType;

public class DataTypeCreateRequest
{
    public string? Description { get; set; }
    public int InstanceId { get; set; }
    public IEnumerable<DataTypeFieldCreateRequest> Fields { get; set; }
    public string Name { get; set; }
    public int? RequesterId { get; set; }
}