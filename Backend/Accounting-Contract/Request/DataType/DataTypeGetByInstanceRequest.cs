namespace Accounting.Contract.Request.DataType;

public class DataTypeGetByInstanceRequest
{
    public int InstanceId { get; set; }
    public int? RequesterId { get; set; }
}