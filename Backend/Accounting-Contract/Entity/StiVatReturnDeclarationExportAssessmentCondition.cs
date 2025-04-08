using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class StiVatReturnDeclarationExportAssessmentCondition
{
    /// <summary>
    /// Classification's code for the assessed condition, 4 characters.
    /// </summary>
    public string Code { get; set; }

    /// <summary>
    /// Assessed condition's description in LT language, 300 characters.
    /// </summary>
    public string Description { get; set; }
    
    /// <summary>
    /// Navigation property to the associated declaration's export.
    /// </summary>
    [ForeignKey(nameof(ExportId))]
    public StiVatReturnDeclarationExport Export { get; set; }
    
    /// <summary>
    /// Export identifier.
    /// </summary>
    public int ExportId { get; set; }
    
    /// <summary>
    /// Identifier of the export's assessment condition.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Result of the condition assessment. Is it met or unmet.
    /// </summary>
    public bool IsMet { get; set; }
}