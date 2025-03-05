using System.Text.Json;
using Accounting.Contract.Entity;
using Accounting.Contract.Response;

namespace Accounting.Services.FieldHandler;

public class TextFieldHandler() : FieldHandler(FieldType.Text)
{
    public override object Deserialize(string value)
    {
        return value;
    }

    public override string Serialize(JsonElement value)
    {
        return value.GetString() ?? String.Empty;
    }

    public override Validation Validate(JsonElement value)
    {
        return new Validation();
    }
}