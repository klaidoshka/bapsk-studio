namespace Accounting.Contract.Dto.DataType;

public class DataType
{
    public string? Description { get; set; }
    public int? DisplayFieldId { get; set; }
    public IList<DataTypeField> Fields { get; set; } = new List<DataTypeField>();
    public int Id { get; set; }
    public int InstanceId { get; set; }
    public string Name { get; set; }
}

public static class DataTypeExtensions
{
    public static DataType ToDto(this Entity.DataType entity)
    {
        return new DataType
        {
            Description = entity.Description,
            DisplayFieldId = entity.DisplayFieldId,
            Fields = entity.Fields
                .Select(x => x.ToDto())
                .ToList(),
            Id = entity.Id,
            InstanceId = entity.InstanceId,
            Name = entity.Name
        };
    }
}