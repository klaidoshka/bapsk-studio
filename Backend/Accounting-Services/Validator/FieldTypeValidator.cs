using System.Text.Json;
using Accounting.Contract.Dto;
using Accounting.Contract.Entity;
using Accounting.Contract.Validator;

namespace Accounting.Services.Validator;

public class FieldTypeValidator : IFieldTypeValidator
{
    private readonly Dictionary<FieldType, FieldHandler.FieldHandler> _fieldHandlers;

    public FieldTypeValidator(Dictionary<FieldType, FieldHandler.FieldHandler> fieldHandlers)
    {
        _fieldHandlers = fieldHandlers;
    }

    public Validation ValidateValue(DataTypeField field, JsonElement value)
    {
        var validation = ValidateValue(field.Type, value);

        if (validation.IsValid)
        {
            return validation;
        }

        return new Validation(
            validation.FailureMessages
                .Select(f => $"Field {field.Name}: {f}")
                .ToHashSet()
        );
    }

    public Validation ValidateValue(FieldType type, JsonElement value)
    {
        return !_fieldHandlers.TryGetValue(type, out var handler)
            ? new Validation($"Field type {type} is not supported.")
            : handler.Validate(value);
    }
}