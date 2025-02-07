using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Contract.Entity;

[PrimaryKey(nameof(Id))]
public class InstanceUserMeta
{
    /// <summary>
    /// Unique identifier for the instance user meta.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Navigation property for the instance.
    /// </summary>
    [ForeignKey(nameof(InstanceId))]
    public Instance Instance { get; set; }

    /// <summary>
    /// Unique identifier for the instance.
    /// </summary>
    public Guid InstanceId { get; set; }

    /// <summary>
    /// Navigation property for the user.
    /// </summary>
    [ForeignKey(nameof(UserId))]
    public User User { get; set; }

    /// <summary>
    /// Unique identifier for the user.
    /// </summary>
    public Guid UserId { get; set; }
}