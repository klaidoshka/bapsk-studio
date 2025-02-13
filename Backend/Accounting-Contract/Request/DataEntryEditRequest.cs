namespace Accounting.Contract.Request;

public class DataEntryEditRequest
{
    public int DataEntryId { get; set; }
    public int? RequesterId { get; set; }
    public IEnumerable<DataEntryFieldEditRequest> Fields { get; set; }
}