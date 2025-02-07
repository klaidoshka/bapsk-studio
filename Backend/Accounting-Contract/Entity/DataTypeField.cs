using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class DataTypeField
{
    /// <summary>
    /// Navigation property for the data type that the field belongs to.
    /// </summary>
    [ForeignKey(nameof(DataTypeId))]
    public DataType DataType { get; set; }

    /// <summary>
    /// Unique identifier of the data type that the field belongs to.
    /// </summary>
    public Guid DataTypeId { get; set; }

    /// <summary>
    /// Default value of the field, can be undefined.
    /// </summary>
    public string? DefaultValue { get; set; }

    /// <summary>
    /// Unique identifier of the field.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Marks the field as required or not.
    /// </summary>
    public bool IsRequired { get; set; }

    /// <summary>
    /// Name of the field.
    /// </summary>
    [StringLength(
        100,
        ErrorMessage = "Field name must be between 1 and 100 characters.",
        MinimumLength = 1
    )]
    public string Name { get; set; }

    /// <summary>
    /// Type of the field value.
    /// </summary>
    public FieldType Type { get; set; }
}