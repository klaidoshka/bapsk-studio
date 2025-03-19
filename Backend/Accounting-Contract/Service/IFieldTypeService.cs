using System.Text.Json;
using Accounting.Contract.Entity;

namespace Accounting.Contract.Service;

public interface IFieldTypeService
{
    public object Deserialize(FieldType type, string value);

    public string Serialize(FieldType type, JsonElement value);
}