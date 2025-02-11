using System.Text.Json;
using Accounting.Contract.Entity;
using Accounting.Contract.Response;

namespace Accounting.Services.FieldHandler;

public class DateFieldHandler() : FieldHandler(FieldType.Date)
{
    public override object Deserialize(string value)
    {
        try
        {
            return JsonSerializer.Deserialize<DateTime>(value);
        }
        catch (JsonException e)
        {
            throw new InvalidOperationException("Value cannot be deserialized to a date.", e);
        }
    }

    public override string Serialize(object value)
    {
        return JsonSerializer.Serialize(ToDateTime(value));
    }

    private static DateTime? ToDateTime(object value)
    {
        return value switch
        {
            DateTime dateTimeValue => dateTimeValue,
            DateOnly dateOnlyValue => dateOnlyValue.ToDateTime(TimeOnly.MinValue),
            string stringValue => DateTime.TryParse(stringValue, out var candidate)
                ? candidate
                : throw new InvalidOperationException("Value cannot be deserialized to a date."),
            _ => throw new InvalidOperationException("Value cannot be deserialized to a date.")
        };
    }

    public override Validation Validate(object value)
    {
        try
        {
            ToDateTime(value);

            return new Validation();
        }
        catch (InvalidOperationException e)
        {
            return new Validation(e.Message);
        }
    }
}