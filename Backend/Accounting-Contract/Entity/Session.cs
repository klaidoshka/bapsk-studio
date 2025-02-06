using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class Session
{
    public string Agent { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid Id { get; set; }

    public string IpAddress { get; set; }

    public string Location { get; set; }

    public string RefreshToken { get; set; }

    public Guid UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; }
}