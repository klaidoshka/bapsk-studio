namespace Accounting.Contract.Service.Request;

public class DataEntryEditRequest
{
    public int Id { get; set; }
    public int ManagerId { get; set; }
    public Dictionary<int, object> Values { get; set; }
}