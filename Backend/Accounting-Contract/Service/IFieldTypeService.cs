using System.Text.Json;
using Accounting.Contract.Entity;

namespace Accounting.Contract.Service;

public interface IFieldTypeService
{
    /// <summary>
    /// Deserialize a field value based on its field type.
    /// </summary>
    /// <param name="type">Field type</param>
    /// <param name="value">Field value</param>
    /// <returns>Deserialized value</returns>
    public object Deserialize(FieldType type, string value);

    /// <summary>
    /// Serialize a field value based on its field type.
    /// </summary>
    /// <param name="type">Field type</param>
    /// <param name="value">Field value</param>
    /// <returns>Serialized value</returns>
    public string Serialize(FieldType type, JsonElement value);
}