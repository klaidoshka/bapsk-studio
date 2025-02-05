namespace Accounting.Services.Entity;

public class Session
{
    public required string Agent { get; set; }
    public required DateTime CreatedAt { get; set; }
    public required Guid Id { get; set; }
    public required string IpAddress { get; set; }
    public required string Location { get; set; }
    public required Guid UserId { get; set; }
}