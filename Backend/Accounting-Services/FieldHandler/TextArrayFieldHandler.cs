using System.Text.Json;
using Accounting.Contract.Entity;
using Accounting.Contract.Result;

namespace Accounting.Services.FieldHandler;

public class TextArrayFieldHandler() : FieldHandler(FieldType.TextArray)
{
    public override object Deserialize(string value)
    {
        try
        {
            return JsonSerializer.Deserialize<IEnumerable<string>>(value);
        }
        catch (JsonException e)
        {
            throw new InvalidOperationException("Value cannot be deserialized to a string array.", e);
        }
    }

    public override string Serialize(object value)
    {
        return JsonSerializer.Serialize(ToStringArray(value));
    }

    private static IEnumerable<string> ToStringArray(object value)
    {
        return value switch
        {
            IEnumerable<string> stringArrayValue => stringArrayValue,
            IEnumerable<int> intArrayValue => intArrayValue.Select(i => i.ToString()),
            IEnumerable<double> doubleArrayValue => doubleArrayValue.Select(d => d.ToString()),
            _ => throw new InvalidOperationException("Value cannot be deserialized to a string array.")
        };
    }

    public override Validation Validate(object value)
    {
        try
        {
            ToStringArray(value);

            return new Validation();
        }
        catch (InvalidOperationException e)
        {
            return new Validation(e.Message);
        }
    }
}