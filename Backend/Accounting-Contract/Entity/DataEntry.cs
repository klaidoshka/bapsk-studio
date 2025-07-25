using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class DataEntry
{
    /// <summary>
    /// The date and time the data entry was created.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Navigation property for the user who created the data entry.
    /// </summary>
    [ForeignKey(nameof(CreatedById))]
    public User CreatedBy { get; set; }

    /// <summary>
    /// Unique identifier of the user who created the data entry.
    /// </summary>
    public int CreatedById { get; set; }

    /// <summary>
    /// Navigation property for the data type of the data entry.
    /// </summary>
    [ForeignKey(nameof(DataTypeId))]
    public DataType DataType { get; set; }

    /// <summary>
    /// Unique identifier of the data type of the data entry.
    /// </summary>
    public int DataTypeId { get; set; }

    /// <summary>
    /// Navigation property for the fields of the data entry.
    /// </summary>
    public ICollection<DataEntryField> Fields { get; set; } = new List<DataEntryField>();

    /// <summary>
    /// Unique identifier of the data entry.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Marks the data entry as deleted, but does not remove it from the database.
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    /// Last date and time the data entry was modified.
    /// </summary>
    public DateTime ModifiedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Navigation property for the user who last modified the data entry.
    /// It may be Admin of the application, having no ties to the Instance containing the data entry.
    /// </summary>
    [ForeignKey(nameof(ModifiedById))]
    public User ModifiedBy { get; set; }

    /// <summary>
    /// Unique identifier of the user who last modified the data entry.
    /// </summary>
    public int ModifiedById { get; set; }
}