namespace Accounting.Contract.Dto.DataType;

public class DataTypeEditRequest
{
    public string? Description { get; set; }
    public int DataTypeId { get; set; }
    public IEnumerable<DataTypeFieldEditRequest> Fields { get; set; }
    public string Name { get; set; }
    public int? RequesterId { get; set; }
}