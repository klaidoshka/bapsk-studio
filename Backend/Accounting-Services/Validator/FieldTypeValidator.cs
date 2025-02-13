using Accounting.Contract.Entity;
using Accounting.Contract.Response;
using Accounting.Contract.Validator;

namespace Accounting.Services.Validator;

public class FieldTypeValidator : IFieldTypeValidator
{
    public Validation ValidateValue(DataTypeField field, object value)
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

    public Validation ValidateValue(FieldType type, object value)
    {
        return !FieldHandler.FieldHandler.Handlers.TryGetValue(type, out var handler)
            ? new Validation($"Type {type} is not supported.")
            : handler.Validate(value);
    }

    public Validation ValidateValues(ICollection<DataTypeField> fields, IDictionary<int, object> values)
    {
        var failures = new List<string>();

        foreach (var field in fields)
        {
            if (field.IsRequired && !values.ContainsKey(field.Id))
            {
                failures.Add($"Field {field.Name} is required.");
                continue;
            }

            if (!values.TryGetValue(field.Id, out var value))
            {
                continue;
            }

            var validation = ValidateValue(field, value);

            if (!validation.IsValid)
            {
                failures.AddRange(validation.FailureMessages);
            }
        }

        return new Validation(failures);
    }
}