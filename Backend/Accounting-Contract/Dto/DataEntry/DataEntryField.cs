namespace Accounting.Contract.Dto.DataEntry;

public class DataEntryField
{
    public int DataEntryId { get; set; }
    public int DataTypeFieldId { get; set; }
    public int Id { get; set; }
    public string Value { get; set; }
}

public static class DataEntryFieldMappings
{
    public static DataEntryField ToDto(this Entity.DataEntryField entity)
    {
        return new DataEntryField
        {
            DataEntryId = entity.DataEntryId,
            DataTypeFieldId = entity.DataTypeFieldId,
            Id = entity.Id,
            Value = entity.Value
        };
    }
}