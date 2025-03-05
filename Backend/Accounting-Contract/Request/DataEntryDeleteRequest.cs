namespace Accounting.Contract.Request;

public class DataEntryDeleteRequest
{
    public int DataEntryId { get; set; }
    public int? RequesterId { get; set; }
}