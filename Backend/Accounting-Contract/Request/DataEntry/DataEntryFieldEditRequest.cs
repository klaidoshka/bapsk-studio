using System.Text.Json;

namespace Accounting.Contract.Request.DataEntry;

public class DataEntryFieldEditRequest
{
    public int DataEntryFieldId { get; set; }
    public JsonElement Value { get; set; }
}