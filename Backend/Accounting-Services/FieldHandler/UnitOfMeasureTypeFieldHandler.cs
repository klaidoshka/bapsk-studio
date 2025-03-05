using System.Text.Json;
using Accounting.Contract.Dto.StiVatReturn;
using Accounting.Contract.Entity;
using Accounting.Contract.Response;

namespace Accounting.Services.FieldHandler;

public class UnitOfMeasureTypeFieldHandler() : FieldHandler(FieldType.UnitOfMeasureType)
{
    public override object Deserialize(string value)
    {
        return ToType(value);
    }

    public override string Serialize(JsonElement value)
    {
        return ToType(value).ToString();
    }

    private static UnitOfMeasureType ToType(object value)
    {
        UnitOfMeasureType? result = value switch
        {
            JsonElement jsonElement => Enum.TryParse<UnitOfMeasureType>(
                jsonElement.GetString(),
                true,
                out var candidate
            )
                ? candidate
                : null,
            string stringValue => Enum.TryParse<UnitOfMeasureType>(
                stringValue,
                true,
                out var candidate
            )
                ? candidate
                : null,
            _ => null
        };

        return result ?? throw new InvalidOperationException(
            $"Value {value} cannot be deserialized to an unit of measure type."
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