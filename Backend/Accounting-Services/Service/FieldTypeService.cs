using Accounting.Contract.Entity;
using Accounting.Contract.Service;

namespace Accounting.Services.Service;

public class FieldTypeService : IFieldTypeService
{
    public object Deserialize(FieldType type, string value)
    {
        return !FieldHandler.FieldHandler.Handlers.TryGetValue(type, out var handler)
            ? throw new InvalidOperationException($"Type {type} is not supported.")
            : handler.Deserialize(value);
    }

    public string Serialize(FieldType type, object value)
    {
        return !FieldHandler.FieldHandler.Handlers.TryGetValue(type, out var handler)
            ? throw new InvalidOperationException($"Type {type} is not supported.")
            : handler.Serialize(value);
    }
}