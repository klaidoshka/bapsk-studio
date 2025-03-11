namespace Accounting.Contract.Dto.DataEntry;

public class DataEntryDeleteRequest
{
    public int DataEntryId { get; set; }
    public int? RequesterId { get; set; }
}