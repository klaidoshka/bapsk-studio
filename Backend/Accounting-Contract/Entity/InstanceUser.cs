using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class InstanceUser
{
    /// <summary>
    /// Unique identifier for the instance user meta.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Navigation property to the instance.
    /// </summary>
    [ForeignKey(nameof(InstanceId))]
    public Instance Instance { get; set; }

    /// <summary>
    /// Unique identifier for the instance.
    /// </summary>
    public int InstanceId { get; set; }

    /// <summary>
    /// Navigation property to the permissions of the user within the instance.
    /// </summary>
    public ICollection<InstanceUserPermission> Permissions { get; set; } = new List<InstanceUserPermission>();

    /// <summary>
    /// Navigation property for the user.
    /// </summary>
    [ForeignKey(nameof(UserId))]
    public User User { get; set; }

    /// <summary>
    /// Unique identifier for the user.
    /// </summary>
    public int UserId { get; set; }
}