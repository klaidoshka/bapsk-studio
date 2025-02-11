using System.Text.Json;
using Accounting.Contract.Entity;
using Accounting.Contract.Response;

namespace Accounting.Services.FieldHandler;

public class IntArrayFieldHandler() : FieldHandler(FieldType.IntArray)
{
    public override object Deserialize(string value)
    {
        try
        {
            return JsonSerializer.Deserialize<IEnumerable<int>>(value);
        }
        catch (JsonException e)
        {
            throw new InvalidOperationException("Value cannot be deserialized to an int array.", e);
        }
    }

    public override string Serialize(object value)
    {
        return JsonSerializer.Serialize(ToIntArray(value));
    }

    private static IEnumerable<int> ToIntArray(object value)
    {
        return value switch
        {
            IEnumerable<int> intArrayValue => intArrayValue,
            IEnumerable<double> doubleArrayValue => doubleArrayValue.Select(d => (int)d),
            IEnumerable<string> stringArrayValue => stringArrayValue.Select(int.Parse),
            _ => throw new InvalidOperationException("Value cannot be deserialized to an int array.")
        };
    }

    public override Validation Validate(object value)
    {
        try
        {
            ToIntArray(value);

            return new Validation();
        }
        catch (InvalidOperationException e)
        {
            return new Validation(e.Message);
        }
    }
}