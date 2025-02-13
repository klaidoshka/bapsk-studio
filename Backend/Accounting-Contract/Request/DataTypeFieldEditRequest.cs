using Accounting.Contract.Entity;

namespace Accounting.Contract.Request;

public class DataTypeFieldEditRequest
{
    public object? DefaultValue { get; set; }
    public int? DataTypeFieldId { get; set; }
    public bool IsRequired { get; set; }
    public string Name { get; set; }
    public FieldType Type { get; set; }
}