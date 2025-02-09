using Accounting.Contract.Entity;

namespace Accounting.Contract.Service.Request;

public class DataTypeFieldEditRequest
{
    public string? DefaultValue { get; set; }
    public int Id { get; set; }
    public bool? IsRequired { get; set; }
    public int ManagerId { get; set; }
    public string Name { get; set; }
    public FieldType Type { get; set; }
}