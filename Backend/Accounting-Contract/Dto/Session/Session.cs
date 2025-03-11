namespace Accounting.Contract.Dto.Session;

public class Session
{
    public string Agent { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid Id { get; set; }
    public string IpAddress { get; set; }
    public string Location { get; set; }
    public int UserId { get; set; }
}

public static class SessionMappings
{
    public static Session ToDto(this Entity.Session entity)
    {
        return new Session
        {
            Agent = entity.Agent,
            CreatedAt = entity.CreatedAt,
            Id = entity.Id,
            IpAddress = entity.IpAddress,
            Location = entity.Location,
            UserId = entity.UserId
        };
    }
}