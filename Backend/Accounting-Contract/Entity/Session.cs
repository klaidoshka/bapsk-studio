using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Contract.Entity;

[PrimaryKey(nameof(Id))]
public class Session
{
    /// <summary>
    /// Agent of the user who created the session. Browser, OS, etc.
    /// </summary>
    public string Agent { get; set; }

    /// <summary>
    /// When the session was created.
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Unique identifier of the session.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// IP address of the user who created the session.
    /// </summary>
    public string IpAddress { get; set; }

    /// <summary>
    /// Location of the user who created the session.
    /// </summary>
    public string Location { get; set; }

    /// <summary>
    /// Refresh token used to refresh the session's access token.
    /// </summary>
    public string RefreshToken { get; set; }

    /// <summary>
    /// Navigation property for the user who created the session.
    /// </summary>
    [ForeignKey(nameof(UserId))]
    public User User { get; set; }

    /// <summary>
    /// Unique identifier of the user who created the session.
    /// </summary>
    public Guid UserId { get; set; }
}