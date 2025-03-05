namespace Accounting.Contract.Dto;

public class DataEntry
{
    public DateTime CreatedAt { get; set; }
    public int CreatedById { get; set; }
    public int DataTypeId { get; set; }
    public IEnumerable<DataEntryField> Fields { get; set; }
    public int Id { get; set; }
    public DateTime? ModifiedAt { get; set; }
    public int? ModifiedById { get; set; }
}

public static class DataEntryMappings
{
    public static DataEntry ToDto(this Entity.DataEntry entity)
    {
        return new DataEntry
        {
            CreatedAt = entity.CreatedAt,
            CreatedById = entity.CreatedById,
            DataTypeId = entity.DataTypeId,
            Fields = entity.Fields
                .Select(x => x.ToDto())
                .ToList(),
            Id = entity.Id,
            ModifiedAt = entity.ModifiedAt,
            ModifiedById = entity.ModifiedById
        };
    }
}