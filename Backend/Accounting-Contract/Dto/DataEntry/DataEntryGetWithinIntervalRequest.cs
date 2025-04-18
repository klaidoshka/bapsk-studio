namespace Accounting.Contract.Dto.DataEntry;

public class DataEntryGetWithinIntervalRequest
{
    public int DataTypeId { get; set; }
    public DateTime From { get; set; }
    public DateTime To { get; set; }
}