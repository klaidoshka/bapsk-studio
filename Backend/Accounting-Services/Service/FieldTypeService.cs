using System.Text.Json;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;

namespace Accounting.Services.Service;

public class FieldTypeService : IFieldTypeService
{
    private readonly Dictionary<FieldType, FieldHandler.FieldHandler> _fieldHandlers;

    public FieldTypeService(Dictionary<FieldType, FieldHandler.FieldHandler> fieldHandlers)
    {
        _fieldHandlers = fieldHandlers;
    }

    public object Deserialize(FieldType type, string value)
    {
        return !_fieldHandlers.TryGetValue(type, out var handler)
            ? throw new InvalidOperationException($"Type {type} is not supported.")
            : handler.Deserialize(value);
    }

    public string Serialize(FieldType type, JsonElement value)
    {
        return !_fieldHandlers.TryGetValue(type, out var handler)
            ? throw new InvalidOperationException($"Type {type} is not supported.")
            : handler.Serialize(value);
    }
}