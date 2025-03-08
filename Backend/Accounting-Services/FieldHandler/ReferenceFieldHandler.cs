using System.Text.Json;
using Accounting.Contract;
using Accounting.Contract.Entity;
using Accounting.Contract.Response;

namespace Accounting.Services.FieldHandler;

public class ReferenceFieldHandler() : FieldHandler(FieldType.Reference)
{
    private readonly AccountingDatabase _database;

    public ReferenceFieldHandler(AccountingDatabase database) : this()
    {
        _database = database;
    }

    public override object Deserialize(string value)
    {
        return ToReferenceId(value);
    }

    public override string Serialize(JsonElement value)
    {
        return ToReferenceId(value).ToString();
    }

    private static int ToReferenceId(object value)
    {
        int? result = value switch
        {
            JsonElement jsonElement => jsonElement.ValueKind switch
            {
                JsonValueKind.String => Int32.TryParse(jsonElement.GetString(), out var candidate)
                    ? candidate
                    : null,
                JsonValueKind.Number => jsonElement.GetInt32(),
                _ => null
            },
            string stringValue => Int32.TryParse(stringValue, out var candidate)
                ? candidate
                : null,
            _ => null
        };

        return result ?? throw new InvalidOperationException(
            $"Value {value} cannot be deserialized to a reference id."
        );
    }

    public override Validation Validate(JsonElement value)
    {
        try
        {
            var id = ToReferenceId(value);

            return _database.DataTypes.Find(id) == null
                ? new Validation($"Reference with id {id} does not exist.")
                : new Validation();
        }
        catch (InvalidOperationException e)
        {
            return new Validation(e.Message);
        }
    }
}