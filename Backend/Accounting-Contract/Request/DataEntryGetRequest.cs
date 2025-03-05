namespace Accounting.Contract.Request;

public class DataEntryGetRequest
{
    public int DataEntryId { get; set; }
    public int? RequesterId { get; set; }
}