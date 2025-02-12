namespace Accounting.Contract.Request;

public class DataEntryEditRequest
{
    public int Id { get; set; }
    public int ManagerId { get; set; }
    public Dictionary<int, object> Values { get; set; }
}