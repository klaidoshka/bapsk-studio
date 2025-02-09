namespace Accounting.Contract.Service.Request;

public class DataEntryCreateRequest
{
    public int CreatorId { get; set; }
    public int DataTypeId { get; set; }
    public Dictionary<int, string> Values { get; set; }
}