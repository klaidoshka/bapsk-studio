namespace Accounting.Contract.Request.DataEntry;

public class DataEntryGetByDataTypeRequest
{
    public int DataTypeId { get; set; }
    public int? RequesterId { get; set; }
}