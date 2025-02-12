namespace Accounting.Contract.Request;

public class DataEntryCreateRequest
{
    public int CreatorId { get; set; }
    public int DataTypeId { get; set; }
    public Dictionary<int, object> Values { get; set; }
}