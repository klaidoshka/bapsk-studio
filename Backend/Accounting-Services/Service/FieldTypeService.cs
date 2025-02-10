using Accounting.Contract.Entity;
using Accounting.Contract.Result;
using Accounting.Contract.Service;
using Accounting.Services.FieldHandler;

namespace Accounting.Services.Service;

public class FieldTypeService : IFieldTypeService
{
    private readonly Dictionary<FieldType, FieldHandler.FieldHandler> _handlers = new()
    {
        { FieldType.Check, new CheckFieldHandler() },
        { FieldType.Date, new DateFieldHandler() },
        { FieldType.Decimal, new DecimalFieldHandler() },
        { FieldType.DecimalArray, new DecimalArrayFieldHandler() },
        { FieldType.Int, new IntFieldHandler() },
        { FieldType.IntArray, new IntArrayFieldHandler() },
        { FieldType.Text, new TextFieldHandler() },
        { FieldType.TextArray, new TextArrayFieldHandler() }
    };

    public object Deserialize(FieldType type, string value)
    {
        return !_handlers.TryGetValue(type, out var handler)
            ? throw new InvalidOperationException($"Type {type} is not supported.")
            : handler.Deserialize(value);
    }

    public string Serialize(FieldType type, object value)
    {
        return !_handlers.TryGetValue(type, out var handler)
            ? throw new InvalidOperationException($"Type {type} is not supported.")
            : handler.Serialize(value);
    }

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
        return !_handlers.TryGetValue(type, out var handler)
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