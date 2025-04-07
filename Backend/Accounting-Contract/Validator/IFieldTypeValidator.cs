using System.Text.Json;
using Accounting.Contract.Dto;
using Accounting.Contract.Entity;

namespace Accounting.Contract.Validator;

public interface IFieldTypeValidator
{
    public Validation ValidateValue(DataTypeField field, JsonElement value);

    public Validation ValidateValue(FieldType type, JsonElement value);

    public Validation ValidateValue(FieldType type, string value) => ValidateValue(type, JsonSerializer.SerializeToElement(value));
}