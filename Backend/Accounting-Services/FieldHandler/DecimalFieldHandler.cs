using Accounting.Contract.Entity;
using Accounting.Contract.Result;

namespace Accounting.Services.FieldHandler;

public class DecimalFieldHandler() : FieldHandler(FieldType.Decimal)
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
            string stringValue => double.Parse(stringValue),
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