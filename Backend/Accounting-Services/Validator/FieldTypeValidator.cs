using System.Text.Json;
using Accounting.Contract.Entity;
using Accounting.Contract.Response;
using Accounting.Contract.Validator;

namespace Accounting.Services.Validator;

public class FieldTypeValidator : IFieldTypeValidator
{
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
        return !FieldHandler.FieldHandler.Handlers.TryGetValue(type, out var handler)
            ? new Validation($"Field type {type} is not supported.")
            : handler.Validate(value);
    }

    public Validation ValidateValues(
        ICollection<DataTypeField> fields,
        IDictionary<int, JsonElement> values
    )
    {
        var failures = new List<string>();

        foreach (var field in fields)
        {
            // Check whether field is required but not provided and has no default value
            if (field.IsRequired && field.DefaultValue == null && !values.ContainsKey(field.Id))
            {
                failures.Add($"Field '{field.Name}' is required.");

                continue;
            }

            // If value not provided, means default value will be used, skip validation
            if (!values.TryGetValue(field.Id, out var value))
            {
                continue;
            }

            // Validate provided value
            var validation = ValidateValue(field, value);

            failures.AddRange(validation.FailureMessages);
        }

        return new Validation(failures);
    }
}