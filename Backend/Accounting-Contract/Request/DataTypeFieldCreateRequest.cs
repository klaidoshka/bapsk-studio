using Accounting.Contract.Entity;

namespace Accounting.Contract.Request;

public class DataTypeFieldCreateRequest
{
    public object? DefaultValue { get; set; }
    public bool IsRequired { get; set; }
    public string Name { get; set; }
    public FieldType Type { get; set; }
}