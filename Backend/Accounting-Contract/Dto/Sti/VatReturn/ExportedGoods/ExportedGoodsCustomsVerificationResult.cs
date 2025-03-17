namespace Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;

public class ExportedGoodsCustomsVerificationResult
{
    /// <summary>
    ///     Date-time of verification's correction if it was corrected, yyyy-MM-ddTHH:mm:ss.
    ///     Correction could happen if the verification happened not programmatically.
    /// </summary>
    public DateTime CorrectionDate { get; set; }

    /// <summary>
    ///     Customs office code that performed the verification, 8 characters.
    ///     Codes: https://www.e-tar.lt/portal/lt/legalAct/TAR.69CAB1BC988C/asr
    /// </summary>
    public required string CustomsOfficeCode { get; set; }

    /// <summary>
    ///     Declaration's last correction number, 2 characters.
    /// </summary>
    public required string DocumentCorrectionNo { get; set; }

    /// <summary>
    ///     Unique declaration identifier, 34 characters.
    /// </summary>
    public required string DocumentId { get; set; }

    /// <summary>
    ///     Date-time of goods export verification, yyyy-MM-ddTHH:mm:ss.
    /// </summary>
    public required DateTime VerificationDate { get; set; }

    /// <summary>
    ///     Final result of the verification at customs, 2 characters.
    /// </summary>
    public required ExportedGoodsCustomsVerificationResultType VerificationResult { get; set; }

    /// <summary>
    ///     Information regarding the goods that were verified.
    ///     All goods are returned. No matter their export status.
    /// </summary>
    public required IReadOnlyList<ExportedGoodsVerifiedGoods> VerifiedGoods { get; set; }
}