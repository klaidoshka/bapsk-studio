using Accounting.Contract.Entity;
using Accounting.Contract.Response;

namespace Accounting.Services.FieldHandler;

public class NumberFieldHandler() : FieldHandler(FieldType.Number)
{
    public override object Deserialize(string value)
    {
        return ToDouble(value);
    }

    public override string Serialize(object value)
    {
        return ToDouble(value).ToString();
    }

    private static double ToDouble(object value)
    {
        return value switch
        {
            double doubleValue => doubleValue,
            int intValue => intValue,
            string stringValue => Double.Parse(stringValue),
            _ => throw new InvalidOperationException("Value cannot be deserialized to a decimal.")
        };
    }

    public override Validation Validate(object value)
    {
        try
        {
            ToDouble(value);

            return new Validation();
        }
        catch (InvalidOperationException e)
        {
            return new Validation(e.Message);
        }
    }
}