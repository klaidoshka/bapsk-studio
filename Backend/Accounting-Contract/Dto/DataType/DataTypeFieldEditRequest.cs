using System.Text.Json;
using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.DataType;

public class DataTypeFieldEditRequest
{
    public JsonElement DefaultValue { get; set; }
    public int? DataTypeFieldId { get; set; }
    public bool IsRequired { get; set; }
    public string Name { get; set; }
    public int? ReferenceId { get; set; }
    public FieldType Type { get; set; }
}