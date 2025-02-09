namespace Accounting.Contract.Service.Request;

public class DataEntryFieldCreateRequest
{
    public int DataEntryId { get; set; }
    public int DataTypeFieldId { get; set; }
    public string Value { get; set; }
}