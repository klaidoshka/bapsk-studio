using System.Text.Json;
using Accounting.Contract.Dto;
using Accounting.Contract.Entity;

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
            JsonElement jsonElement => jsonElement.ValueKind switch
            {
                JsonValueKind.String => ToCountry(jsonElement.GetString()!),
                JsonValueKind.Number => ToCountry(jsonElement.GetDouble()),
                _ => null
            },
            string stringValue => Enum.TryParse<IsoCountryCode>(
                stringValue,
                true,
                out var candidate
            )
                ? candidate
                : null,
            int intValue => Enum.IsDefined(typeof(IsoCountryCode), intValue)
                ? (IsoCountryCode)intValue
                : null,
            _ => null
        };

        return result ?? throw new InvalidOperationException(
            $"Value {value} cannot be deserialized to the ISO country code."
        );
    }

    public override Task<Validation> ValidateAsync(JsonElement value)
    {
        try
        {
            ToCountry(value);

            return Task.FromResult(new Validation());
        }
        catch (InvalidOperationException e)
        {
            return Task.FromResult(new Validation(e.Message));
        }
    }
}