using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class DataTypeField
{
    /// <summary>
    /// Navigation property for the data type that the field belongs to.
    /// </summary>
    public DataType DataType { get; set; }

    /// <summary>
    /// Unique identifier of the data type that the field belongs to.
    /// </summary>
    public int DataTypeId { get; set; }

    /// <summary>
    /// Default value of the field, can be undefined.
    /// </summary>
    public string? DefaultValue { get; set; }

    /// <summary>
    /// Unique identifier of the field.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Marks the field as required or not.
    /// </summary>
    public bool IsRequired { get; set; } = true;

    /// <summary>
    /// Name of the field.
    /// </summary>
    [StringLength(
        100,
        ErrorMessage = "Field name must be between 1 and 100 characters.",
        MinimumLength = 1
    )]
    public string Name { get; set; } = String.Empty;

    /// <summary>
    /// Navigation property for the reference data type. This is only set when FieldType is Reference.
    /// </summary>
    public DataType? Reference { get; set; }
    
    /// <summary>
    /// Navigation property to the report templates that use this field.
    /// </summary>
    public ICollection<ReportTemplate> ReportTemplates { get; set; }

    /// <summary>
    /// Reference to another data type. This is only set when FieldType is Reference.
    /// </summary>
    public int? ReferenceId { get; set; }

    /// <summary>
    /// Type of the field value.
    /// </summary>
    public FieldType Type { get; set; } = FieldType.Text;
}