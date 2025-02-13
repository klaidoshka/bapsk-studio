namespace Accounting.Contract.Request;

public class DataEntryGetByDataTypeRequest
{
    public int DataTypeId { get; set; }
    public int? RequesterId { get; set; }
}