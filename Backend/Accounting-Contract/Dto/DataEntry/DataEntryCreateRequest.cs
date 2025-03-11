namespace Accounting.Contract.Dto.DataEntry;

public class DataEntryCreateRequest
{
    public int DataTypeId { get; set; }
    public int? RequesterId { get; set; }
    public IEnumerable<DataEntryFieldCreateRequest> Fields { get; set; }
}