namespace Accounting.Contract.Dto.Instance;

public class Instance
{
    public DateTime CreatedAt { get; set; }
    public int CreatedById { get; set; }
    public string? Description { get; set; }
    public int Id { get; set; }
    public string Name { get; set; }
}

public static class InstanceMappings
{
    public static Instance ToDto(this Entity.Instance entity)
    {
        return new Instance
        {
            CreatedAt = entity.CreatedAt,
            CreatedById = entity.CreatedById,
            Description = entity.Description,
            Id = entity.Id,
            Name = entity.Name
        };
    }
}