using System.Text.Json;
using Accounting.Contract.Dto;
using Accounting.Contract.Entity;

namespace Accounting.Services.FieldHandler;

public class CheckFieldHandler() : FieldHandler(FieldType.Check)
{
    public override object Deserialize(string value)
    {
        return ToBoolean(value);
    }

    public override string Serialize(JsonElement value)
    {
        return ToBoolean(value).ToString();
    }

    private static bool ToBoolean(object value)
    {
        bool? result = value switch
        {
            JsonElement jsonElement => jsonElement.ValueKind switch
            {
                JsonValueKind.True => true,
                JsonValueKind.False => false,
                JsonValueKind.String => ToBoolean(jsonElement.GetString()!),
                _ => null
            },
            string stringValue => Boolean.TryParse(stringValue, out var candidate)
                ? candidate
                : null,
            _ => null
        };

        return result ?? throw new InvalidOperationException(
            $"Value {value} cannot be deserialized to a boolean."
        );
    }

    public override Validation Validate(JsonElement value)
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