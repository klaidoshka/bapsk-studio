using System.Text.Json;
using Accounting.Contract.Entity;
using Accounting.Contract.Result;

namespace Accounting.Services.FieldHandler;

public class DecimalArrayFieldHandler() : FieldHandler(FieldType.DecimalArray)
{
    public override object Deserialize(string value)
    {
        try
        {
            return JsonSerializer.Deserialize<IEnumerable<double>>(value);
        }
        catch (JsonException e)
        {
            throw new InvalidOperationException("Value cannot be deserialized to a decimal array.", e);
        }
    }

    public override string Serialize(object value)
    {
        return JsonSerializer.Serialize(ToDoubleArray(value));
    }

    private static IEnumerable<double> ToDoubleArray(object value)
    {
        return value switch
        {
            IEnumerable<double> doubleArrayValue => doubleArrayValue,
            IEnumerable<int> intArrayValue => intArrayValue.Select(i => (double)i),
            IEnumerable<string> stringArrayValue => stringArrayValue.Select(double.Parse),
            _ => throw new InvalidOperationException("Value cannot be deserialized to a decimal array.")
        };
    }

    public override Validation Validate(object value)
    {
        try
        {
            ToDoubleArray(value);

            return new Validation();
        }
        catch (InvalidOperationException e)
        {
            return new Validation(e.Message);
        }
    }
}