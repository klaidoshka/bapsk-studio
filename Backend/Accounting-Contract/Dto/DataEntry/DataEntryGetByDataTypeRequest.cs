namespace Accounting.Contract.Dto.DataEntry;

public class DataEntryGetByDataTypeRequest
{
    public int DataTypeId { get; set; }
    public int? RequesterId { get; set; }
}