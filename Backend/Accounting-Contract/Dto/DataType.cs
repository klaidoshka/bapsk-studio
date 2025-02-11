namespace Accounting.Contract.Dto;

public class DataType
{
    public string? Description { get; set; }
    public int Id { get; set; }
    public bool? IsDeleted { get; set; }
    public int InstanceId { get; set; }
    public string Name { get; set; }
}

public static class DataTypeMappings
{
    public static DataType ToDto(this Entity.DataType entity)
    {
        return new DataType
        {
            Description = entity.Description,
            Id = entity.Id,
            IsDeleted = entity.IsDeleted,
            InstanceId = entity.InstanceId,
            Name = entity.Name
        };
    }
}