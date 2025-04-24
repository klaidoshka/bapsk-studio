namespace Accounting.Contract.Dto.Instance;

public class InstanceUser
{
    public int Id { get; set; }
    public int InstanceId { get; set; }
    public IList<string> Permissions { get; set; }
    public int UserId { get; set; }
}

public static class InstanceUserMappings
{
    public static InstanceUser ToDto(this Entity.InstanceUser entity)
    {
        return new InstanceUser
        {
            Id = entity.Id,
            InstanceId = entity.InstanceId,
            Permissions = entity.Permissions
                .Select(up => up.Permission)
                .ToList(),
            UserId = entity.UserId
        };
    }
}