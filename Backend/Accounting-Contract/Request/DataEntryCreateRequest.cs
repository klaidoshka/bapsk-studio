namespace Accounting.Contract.Request;

public class DataEntryCreateRequest
{
    public int DataTypeId { get; set; }
    public int? RequesterId { get; set; }
    public IEnumerable<DataEntryFieldCreateRequest> Fields { get; set; }
}