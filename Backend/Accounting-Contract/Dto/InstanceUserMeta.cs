namespace Accounting.Contract.Dto;

public class InstanceUserMeta
{
    public int Id { get; set; }
    public int InstanceId { get; set; }
    public int UserId { get; set; }
}

public static class InstanceUserMetaMappings
{
    public static InstanceUserMeta ToDto(this Entity.InstanceUserMeta entity)
    {
        return new InstanceUserMeta
        {
            Id = entity.Id,
            InstanceId = entity.InstanceId,
            UserId = entity.UserId
        };
    }
}