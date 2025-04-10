namespace Accounting.Contract.Dto.DataType;

public class DataTypeCreateRequest
{
    public string? Description { get; set; }
    public int InstanceId { get; set; }
    public IList<DataTypeFieldCreateRequest> Fields { get; set; }
    public string Name { get; set; }
    public int RequesterId { get; set; }
}