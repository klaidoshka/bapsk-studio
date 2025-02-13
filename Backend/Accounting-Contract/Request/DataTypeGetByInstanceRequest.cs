namespace Accounting.Contract.Request;

public class DataTypeGetByInstanceRequest
{
    public int InstanceId { get; set; }
    public int? RequesterId { get; set; }
}