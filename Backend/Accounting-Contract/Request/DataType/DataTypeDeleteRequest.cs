namespace Accounting.Contract.Request.DataType;

public class DataTypeDeleteRequest
{
    public int DataTypeId { get; set; }
    public int? RequesterId { get; set; }
}