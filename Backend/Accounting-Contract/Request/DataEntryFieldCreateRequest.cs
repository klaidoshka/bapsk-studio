using System.Text.Json;

namespace Accounting.Contract.Request;

public class DataEntryFieldCreateRequest
{
    public int DataTypeFieldId { get; set; }
    public JsonElement Value { get; set; }
}