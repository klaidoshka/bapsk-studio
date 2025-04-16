using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class ImportConfigurationField
{
    /// <summary>
    /// Navigation property to the import configuration.
    /// </summary>
    [ForeignKey(nameof(ConfigurationId))]
    public ImportConfiguration Configuration { get; set; }
    
    /// <summary>
    /// Import configuration foreign key.
    /// </summary>
    public int ConfigurationId { get; set; }
    
    /// <summary>
    /// Navigation property to the data type field.
    /// </summary>
    [ForeignKey(nameof(DataTypeFieldId))]
    public DataTypeField DataTypeField { get; set; }
    
    /// <summary>
    /// Data type field foreign key.
    /// </summary>
    public int DataTypeFieldId { get; set; }
    
    /// <summary>
    /// Default value for this field in the import configuration.
    /// </summary>
    public string? DefaultValue { get; set; }
    
    /// <summary>
    /// Unique identifier for the field in the import configuration.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    /// <summary>
    /// The order of the field in the import configuration.
    /// </summary>
    public int Order { get; set; }
}