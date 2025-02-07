using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

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
    [Key]
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
    public int UserId { get; set; }
}