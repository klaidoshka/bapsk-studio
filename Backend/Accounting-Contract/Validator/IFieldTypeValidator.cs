using System.Text.Json;
using Accounting.Contract.Dto;
using Accounting.Contract.Entity;

namespace Accounting.Contract.Validator;

public interface IFieldTypeValidator
{
    public Task<Validation> ValidateAsync(DataTypeField field, JsonElement value);

    public Task<Validation> ValidateAsync(FieldType type, JsonElement value);

    public Task<Validation> ValidateAsync(FieldType type, string value) =>
        ValidateAsync(type, JsonSerializer.SerializeToElement(value));
}