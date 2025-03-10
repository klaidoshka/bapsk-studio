namespace Accounting.Contract.Request.DataEntry;

public class DataEntryGetRequest
{
    public int DataEntryId { get; set; }
    public int? RequesterId { get; set; }
}