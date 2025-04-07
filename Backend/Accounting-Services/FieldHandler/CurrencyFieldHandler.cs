using System.Globalization;
using System.Text.Json;
using Accounting.Contract.Dto;
using Accounting.Contract.Entity;

namespace Accounting.Services.FieldHandler;

public class CurrencyFieldHandler() : FieldHandler(FieldType.Currency)
{
    public override object Deserialize(string value)
    {
        return ToDouble(value);
    }

    public override string Serialize(JsonElement value)
    {
        return ToDouble(value).ToString(CultureInfo.InvariantCulture);
    }

    private static double ToDouble(object value)
    {
        double? result = value switch
        {
            JsonElement jsonElement => jsonElement.ValueKind switch
            {
                JsonValueKind.String => Double.TryParse(jsonElement.GetString(), out var output)
                    ? output
                    : 0.0,
                _ => jsonElement.TryGetDouble(out var output) ? output : null
            },
            string stringValue => Double.TryParse(stringValue, out var output) ? output : null,
            _ => null
        };

        if (result is null)
        {
            throw new InvalidOperationException(
                $"Value {value} cannot be deserialized to a currency."
            );
        }
        
        return Math.Round(result.Value, 2);
    }

    public override Validation Validate(JsonElement value)
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