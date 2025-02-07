using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Contract.Entity;

[PrimaryKey(nameof(Id))]
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
    public Guid DataEntryId { get; set; }

    /// <summary>
    /// Navigation property for the DataTypeField entity.
    /// </summary>
    [ForeignKey(nameof(DataTypeFieldId))]
    public DataTypeField DataTypeField { get; set; }

    /// <summary>
    /// Unique identifier of the DataTypeField entity.
    /// </summary>
    public Guid DataTypeFieldId { get; set; }

    /// <summary>
    /// Unique identifier of the DataEntryField entity.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Value of the field.
    /// </summary>
    [StringLength(
        int.MaxValue,
        ErrorMessage = "Field value must have at least 1 character or do not create a database entry.",
        MinimumLength = 1
    )]
    public string Value { get; set; }
}