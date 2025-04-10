namespace Accounting.Contract.Dto.DataEntry;

public class DataEntryEditRequest
{
    public int DataEntryId { get; set; }
    public int RequesterId { get; set; }
    public IList<DataEntryFieldEditRequest> Fields { get; set; }
}