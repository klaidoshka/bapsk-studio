using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Contract.Entity;

[PrimaryKey(nameof(Id))]
public class DataType
{
    /// <summary>
    /// Navigation property for the user who created the data type.
    /// </summary>
    [ForeignKey(nameof(CreatedById))]
    public User CreatedBy { get; set; }

    /// <summary>
    /// Unique identifier of the user who created the data type.
    /// </summary>
    public Guid CreatedById { get; set; }

    /// <summary>
    /// Description of the data type, can be undefined.
    /// </summary>
    [StringLength(
        255,
        ErrorMessage = "Data description must be less than 255 characters."
    )]
    public string? Description { get; set; }

    /// <summary>
    /// Unique identifier of the data type.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Marks the data type as soft-deleted, but does not remove it from the database.
    /// </summary>
    public bool? IsDeleted { get; set; }

    /// <summary>
    /// Navigation property for the instance that the data type belongs to.
    /// </summary>
    [ForeignKey(nameof(InstanceId))]
    public Instance Instance { get; set; }

    /// <summary>
    /// Unique identifier of the instance that the data type belongs to.
    /// </summary>
    public Guid InstanceId { get; set; }

    /// <summary>
    /// Name of the data type.
    /// </summary>
    [StringLength(
        100,
        ErrorMessage = "Data name must be between 1 and 100 characters.",
        MinimumLength = 1
    )]
    public string Name { get; set; }
}