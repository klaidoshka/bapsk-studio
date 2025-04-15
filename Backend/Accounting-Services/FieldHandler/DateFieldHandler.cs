using System.Globalization;
using System.Text.Json;
using Accounting.Contract.Dto;
using Accounting.Contract.Entity;

namespace Accounting.Services.FieldHandler;

public class DateFieldHandler() : FieldHandler(FieldType.Date)
{
    private static readonly string[] DateFormats = ["s", "u", "r"];

    public override object Deserialize(string value)
    {
        try
        {
            return ToDateTime(value)!.Value;
        }
        catch (Exception e)
        {
            throw new InvalidOperationException(
                $"Value {value} cannot be deserialized to a date.",
                e
            );
        }
    }

    public override string Serialize(JsonElement value)
    {
        return ToDateTime(value)!.Value.ToString("s");
    }

    private static DateTime? ToDateTime(object value)
    {
        var dateTime = value switch
        {
            JsonElement jsonElement => jsonElement.ValueKind == JsonValueKind.String
                ? ToDateTime(jsonElement.GetString()!)
                : null,
            string stringValue => DateTime.TryParseExact(
                stringValue,
                DateFormats,
                DateTimeFormatInfo.InvariantInfo,
                DateTimeStyles.AdjustToUniversal,
                out var candidate
            )
                ? candidate
                : null,
            _ => null
        };

        return dateTime ?? throw new InvalidOperationException(
            $"Value {value} cannot be converted to a date."
        );
    }

    public override Task<Validation> ValidateAsync(JsonElement value)
    {
        try
        {
            ToDateTime(value);

            return Task.FromResult(new Validation());
        }
        catch (InvalidOperationException e)
        {
            return Task.FromResult(new Validation(e.Message));
        }
    }
}