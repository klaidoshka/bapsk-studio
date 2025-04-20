using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class StiVatReturnDeclarationExport
{
    /// <summary>
    /// Date of when did the assessment of associated declaration's export happen.
    /// </summary>
    public DateTime AssessmentDate { get; set; }
    
    /// <summary>
    /// Navigation property to the associated declaration's export assessment result's conditions.
    /// These conditions indicate how the assessment was done and which conditions were met.
    /// </summary>
    public ICollection<StiVatReturnDeclarationExportAssessmentCondition> Conditions { get; set; } = new List<StiVatReturnDeclarationExportAssessmentCondition>();
    
    /// <summary>
    /// Date of verification's correction if it was corrected.
    /// Correction could happen if the verification happened not programmatically.
    /// </summary>
    public DateTime? CorrectionDate { get; set; }

    /// <summary>
    /// Customs office code that performed the verification, 8 characters.
    /// Codes: https://www.e-tar.lt/portal/lt/legalAct/TAR.69CAB1BC988C/asr
    /// </summary>
    public string CustomsOfficeCode { get; set; }
    
    /// <summary>
    /// Navigation property to the associated declaration.
    /// </summary>
    [ForeignKey(nameof(DeclarationId))]
    public StiVatReturnDeclaration Declaration { get; set; }
    
    /// <summary>
    /// Foreign key to the Declaration.
    /// </summary>
    public string DeclarationId { get; set; }

    /// <summary>
    /// Declaration's last correction number, 2 characters.
    /// This is correction number of the declaration that was verified.
    /// This can differ from the joined declaration's correction number, but not be less than it.
    /// </summary>
    public int DeclarationCorrectionNo { get; set; }
    
    /// <summary>
    /// Identifier of the export.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Date of sold goods export verification.
    /// </summary>
    public DateTime VerificationDate { get; set; }

    /// <summary>
    /// Final result of the verification at customs, 2 characters.
    /// </summary>
    public StiVatReturnDeclarationExportVerificationResult VerificationResult { get; set; }

    /// <summary>
    /// Information regarding the goods that were verified.
    /// </summary>
    public ICollection<StiVatReturnDeclarationExportVerifiedGood> VerifiedSoldGoods { get; set; } = new List<StiVatReturnDeclarationExportVerifiedGood>();
}