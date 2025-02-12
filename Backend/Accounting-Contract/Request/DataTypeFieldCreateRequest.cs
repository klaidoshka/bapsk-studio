using Accounting.Contract.Entity;

namespace Accounting.Contract.Request;

public class DataTypeFieldCreateRequest
{
    public int DataTypeId { get; set; }
    public object? DefaultValue { get; set; }
    public int InstanceId { get; set; }
    public bool? IsRequired { get; set; }
    public int ManagerId { get; set; }
    public string Name { get; set; }
    public FieldType Type { get; set; }
}