namespace Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;

public class ExportedGoodsInfo
{
    /// <summary>
    ///     Result from customs integrated system regarding the goods being exported or not exported.
    /// </summary>
    public required ExportedGoodsCustomsVerificationResult CustomsVerificationResult { get; set; }

    /// <summary>
    ///     Assessment result from the customs integrated system regarding the refund for the exported
    ///     goods.
    /// </summary>
    public required ExportedGoodsStiAssessmentResult StiAssessmentResult { get; set; }
}