using System.Text.Json;
using Accounting.Contract.Dto;
using Accounting.Contract.Entity;

namespace Accounting.Services.FieldHandler;

public abstract class FieldHandler(FieldType type)
{
    public FieldType Type { get; } = type;

    public abstract object Deserialize(string value);

    public abstract string Serialize(JsonElement value);

    public abstract Task<Validation> ValidateAsync(JsonElement value);
}