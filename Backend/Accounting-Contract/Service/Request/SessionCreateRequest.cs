namespace Accounting.Contract.Service.Request;

public class SessionCreateRequest
{
    public required string Agent { get; set; }
    public required Guid Id { get; set; }
    public required string IpAddress { get; set; }
    public required string Location { get; set; }
    public required string RefreshToken { get; set; }
    public required int UserId { get; set; }
}