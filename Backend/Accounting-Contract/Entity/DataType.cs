using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class DataType
{
    /// <summary>
    /// Description of the data type, can be undefined.
    /// </summary>
    [StringLength(
        255,
        ErrorMessage = "Data description must be less than 255 characters."
    )]
    public string? Description { get; set; }

    /// <summary>
    /// Data type field id which is used to display this data type.
    /// Used for display in the UI.
    /// </summary>
    public int? DisplayFieldId { get; set; }

    /// <summary>
    /// Navigation property for the entries that the data type has.
    /// </summary>
    public ICollection<DataEntry> Entries { get; set; } = new List<DataEntry>();

    /// <summary>
    /// Navigation property for the fields that the data type has.
    /// </summary>
    public ICollection<DataTypeField> Fields { get; set; } = new List<DataTypeField>();

    /// <summary>
    /// Unique identifier of the data type.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Navigation property for the instance that the data type belongs to.
    /// </summary>
    [ForeignKey(nameof(InstanceId))]
    public Instance Instance { get; set; }

    /// <summary>
    /// Unique identifier of the instance that the data type belongs to.
    /// </summary>
    public int InstanceId { get; set; }

    /// <summary>
    /// Marks the data type as soft-deleted, but does not remove it from the database.
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    /// Name of the data type.
    /// </summary>
    [StringLength(
        100,
        ErrorMessage = "Data name must be between 1 and 100 characters.",
        MinimumLength = 1
    )]
    public string Name { get; set; } = String.Empty;
}