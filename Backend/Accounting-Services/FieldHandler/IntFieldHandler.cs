using Accounting.Contract.Entity;
using Accounting.Contract.Response;

namespace Accounting.Services.FieldHandler;

public class IntFieldHandler() : FieldHandler(FieldType.Int)
{
    public override object Deserialize(string value)
    {
        return ToInt(value);
    }

    public override string Serialize(object value)
    {
        return ToInt(value).ToString();
    }

    private static int ToInt(object value)
    {
        return value switch
        {
            int intValue => intValue,
            double doubleValue => (int)doubleValue,
            string stringValue => int.Parse(stringValue),
            _ => throw new InvalidOperationException("Value cannot be deserialized to an int.")
        };
    }

    public override Validation Validate(object value)
    {
        try
        {
            ToInt(value);

            return new Validation();
        }
        catch (InvalidOperationException e)
        {
            return new Validation(e.Message);
        }
    }
}