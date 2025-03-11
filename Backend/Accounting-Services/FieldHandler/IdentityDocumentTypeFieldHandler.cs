using System.Text.Json;
using Accounting.Contract.Dto;
using Accounting.Contract.Entity;

namespace Accounting.Services.FieldHandler;

public class IdentityDocumentTypeFieldHandler() : FieldHandler(FieldType.IdentityDocumentType)
{
    public override object Deserialize(string value)
    {
        return ToType(value);
    }

    public override string Serialize(JsonElement value)
    {
        return ToType(value).ToString();
    }

    private static IdentityDocumentType ToType(object value)
    {
        IdentityDocumentType? result = value switch
        {
            JsonElement jsonElement => Enum.TryParse<IdentityDocumentType>(
                jsonElement.GetString(),
                true,
                out var candidate
            )
                ? candidate
                : null,
            string stringValue => Enum.TryParse<IdentityDocumentType>(
                stringValue,
                true,
                out var candidate
            )
                ? candidate
                : null,
            _ => null
        };

        return result ?? throw new InvalidOperationException(
            $"Value {value} cannot be deserialized to an ID type."
        );
    }

    public override Validation Validate(JsonElement value)
    {
        try
        {
            ToType(value);

            return new Validation();
        }
        catch (InvalidOperationException e)
        {
            return new Validation(e.Message);
        }
    }
}