using System.Globalization;
using System.Text.Json;
using Accounting.Contract.Dto;
using Accounting.Contract.Entity;

namespace Accounting.Services.FieldHandler;

public class DateFieldHandler() : FieldHandler(FieldType.Date)
{
    private static readonly string[] DateFormats =
    [
        "yyyy-MM-dd",
        "MM/dd/yyyy",
        "dd-MM-yyyy",
        "yyyy/MM/dd",
        "dd/MM/yyyy",
        "yyyy.MM.dd",
        "dd.MM.yyyy",
        "yyyy MM dd",
        "dd MM yyyy",
        "yyyy-MM-ddTHH:mm:ssZ",
        "yyyy-MM-ddTHH:mm:ss.fffZ",
        "yyyy-MM-ddTHH:mm:sszzz",
        "yyyy-MM-ddTHH:mm:ss.fffzzz",
        "yyyy-MM-ddTHH:mm:ss",
        "yyyy-MM-dd HH:mm:ss",
        "MM/dd/yyyy HH:mm:ss",
        "dd-MM-yyyy HH:mm:ss",
        "yyyy/MM/dd HH:mm:ss",
        "dd/MM/yyyy HH:mm:ss",
        "yyyy.MM.dd HH:mm:ss",
        "dd.MM.yyyy HH:mm:ss",
        "yyyy MM dd HH:mm:ss",
        "dd MM yyyy HH:mm:ss"
    ];

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
        return ToDateTime(value)!.Value.ToString("u");
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

    public override Validation Validate(JsonElement value)
    {
        try
        {
            ToDateTime(value);

            return new Validation();
        }
        catch (InvalidOperationException e)
        {
            return new Validation(e.Message);
        }
    }
}