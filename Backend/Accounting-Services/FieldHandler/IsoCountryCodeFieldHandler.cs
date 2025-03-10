using System.Text.Json;
using Accounting.Contract.Entity;
using Accounting.Contract.Response;

namespace Accounting.Services.FieldHandler;

public class IsoCountryCodeFieldHandler() : FieldHandler(FieldType.IsoCountryCode)
{
    public override object Deserialize(string value)
    {
        return ToCountry(value);
    }

    public override string Serialize(JsonElement value)
    {
        return ToCountry(value).ToString();
    }

    private static IsoCountryCode ToCountry(object value)
    {
        IsoCountryCode? result = value switch
        {
            JsonElement jsonElement => Enum.TryParse<IsoCountryCode>(
                jsonElement.GetString(),
                true,
                out var candidate
            )
                ? candidate
                : null,
            string stringValue => Enum.TryParse<IsoCountryCode>(
                stringValue,
                true,
                out var candidate
            )
                ? candidate
                : null,
            _ => null
        };

        return result ?? throw new InvalidOperationException(
            $"Value {value} cannot be deserialized to the ISO country code."
        );
    }

    public override Validation Validate(JsonElement value)
    {
        try
        {
            ToCountry(value);

            return new Validation();
        }
        catch (InvalidOperationException e)
        {
            return new Validation(e.Message);
        }
    }
}