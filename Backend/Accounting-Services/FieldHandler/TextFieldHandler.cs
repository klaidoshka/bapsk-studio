using Accounting.Contract.Entity;
using Accounting.Contract.Response;

namespace Accounting.Services.FieldHandler;

public class TextFieldHandler() : FieldHandler(FieldType.Text)
{
    public override object Deserialize(string value)
    {
        return value;
    }

    public override string Serialize(object value)
    {
        return value.ToString() ?? throw new InvalidOperationException("Value cannot be serialized to a string.");
    }

    public override Validation Validate(object value)
    {
        return new Validation();
    }
}