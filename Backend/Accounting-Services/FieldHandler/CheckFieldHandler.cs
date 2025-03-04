using Accounting.Contract.Entity;
using Accounting.Contract.Response;

namespace Accounting.Services.FieldHandler;

public class CheckFieldHandler() : FieldHandler(FieldType.Check)
{
    public override object Deserialize(string value)
    {
        return ToBoolean(value);
    }

    public override string Serialize(object value)
    {
        return ToBoolean(value).ToString();
    }

    private static bool ToBoolean(object value)
    {
        return value switch
        {
            bool booleanValue => booleanValue,
            string stringValue => Boolean.TryParse(stringValue, out var candidate)
                ? candidate
                : throw new InvalidOperationException("Value cannot be deserialized to a boolean."),
            _ => throw new InvalidOperationException("Value cannot be deserialized to a boolean.")
        };
    }

    public override Validation Validate(object value)
    {
        try
        {
            ToBoolean(value);

            return new Validation();
        }
        catch (InvalidOperationException e)
        {
            return new Validation(e.Message);
        }
    }
}