using Accounting.Contract.Entity;

namespace Accounting.Contract.Service.Request;

public class DataTypeFieldCreateRequest
{
    public int DataTypeId { get; set; }
    public string? DefaultValue { get; set; }
    public int InstanceId { get; set; }
    public bool? IsRequired { get; set; }
    public int ManagerId { get; set; }
    public string Name { get; set; }
    public FieldType Type { get; set; }
}