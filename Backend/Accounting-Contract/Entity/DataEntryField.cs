using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class DataEntryField
{
    /// <summary>
    /// Navigation property for the DataEntry entity.
    /// </summary>
    [ForeignKey(nameof(DataEntryId))]
    public DataEntry DataEntry { get; set; }

    /// <summary>
    /// Unique identifier of the DataEntry entity.
    /// </summary>
    public int DataEntryId { get; set; }

    /// <summary>
    /// Navigation property for the DataTypeField entity.
    /// </summary>
    [ForeignKey(nameof(DataTypeFieldId))]
    public DataTypeField DataTypeField { get; set; }

    /// <summary>
    /// Unique identifier of the DataTypeField entity.
    /// </summary>
    public int DataTypeFieldId { get; set; }

    /// <summary>
    /// Unique identifier of the DataEntryField entity.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Value of the field.
    /// </summary>
    [StringLength(
        Int32.MaxValue,
        ErrorMessage = "Field value must be at least 1 character long.",
        MinimumLength = 1
    )]
    public string Value { get; set; } = String.Empty;
}