using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class Instance
{
    /// <summary>
    /// Date and time when the instance was created.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Navigation property for the user who created the instance.
    /// </summary>
    [ForeignKey(nameof(CreatedById))]
    public User CreatedBy { get; set; }

    /// <summary>
    /// Unique identifier of the user who created the instance.
    /// </summary>
    public int CreatedById { get; set; }

    /// <summary>
    /// Description of the instance, can be undefined.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Unique identifier of the instance.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    /// <summary>
    /// Marks whether the instance is deleted.
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    /// Name of the instance.
    /// </summary>
    [StringLength(
        255,
        ErrorMessage = "Instance name must be between 1 and 255 characters.",
        MinimumLength = 1
    )]
    public string Name { get; set; } = String.Empty;

    /// <summary>
    /// Navigation property for the user metas of the instance.
    /// Metas hold users and their data who can access the instance.
    /// </summary>
    public ICollection<InstanceUserMeta> UserMetas { get; set; } = new List<InstanceUserMeta>();
}