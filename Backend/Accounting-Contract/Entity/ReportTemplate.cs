using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class ReportTemplate
{
    /// <summary>
    /// Navigation property to the user who created the report template.
    /// </summary>
    [ForeignKey(nameof(CreatedById))]
    public User CreatedBy { get; set; }
    
    /// <summary>
    /// Foreign key to the user who created the report template.
    /// </summary>
    public int CreatedById { get; set; }
    
    /// <summary>
    /// Navigation property to the fields this report template contains.
    /// </summary>
    public ICollection<DataTypeField> Fields { get; set; }
    
    /// <summary>
    /// Unique identifier for the report template.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    /// <summary>
    /// Marks the report template as deleted.
    /// </summary>
    public bool IsDeleted { get; set; }
    
    /// <summary>
    /// Name of the report template.
    /// </summary>
    public string Name { get; set; }
}