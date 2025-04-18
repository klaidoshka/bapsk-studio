using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class ImportConfiguration
{
    /// <summary>
    /// Navigation property to the import configuration's data type.
    /// </summary>
    [ForeignKey(nameof(DataTypeId))]
    public DataType DataType { get; set; }
    
    /// <summary>
    /// Data type foreign key.
    /// </summary>
    public int DataTypeId { get; set; }
    
    /// <summary>
    /// Navigation property to this import configuration's fields and their metadata.
    /// </summary>
    public ICollection<ImportConfigurationField> Fields { get; set; } = new List<ImportConfigurationField>();
    
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    /// <summary>
    /// Name of the import configuration.
    /// </summary>
    public string Name { get; set; }
}