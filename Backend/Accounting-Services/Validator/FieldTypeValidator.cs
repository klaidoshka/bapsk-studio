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

    public async Task<Validation> ValidateAsync(DataTypeField field, JsonElement value)
    {
        var validation = await ValidateAsync(field.Type, value);

        if (validation.IsValid)
        {
            return validation;
        }

        return new Validation(
            validation.FailureMessages
                .Select(f => $"Field '{field.Name}': {f}")
                .ToHashSet()
        );
    }

    public Task<Validation> ValidateAsync(FieldType type, JsonElement value)
    {
        return !_fieldHandlers.TryGetValue(type, out var handler)
            ? Task.FromResult(new Validation($"Field type {type} is not supported."))
            : handler.ValidateAsync(value);
    }
}