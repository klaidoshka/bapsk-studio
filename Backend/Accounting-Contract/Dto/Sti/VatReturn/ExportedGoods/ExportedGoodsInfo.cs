namespace Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;

public class ExportedGoodsInfo
{
    public required ExportedGoodsCustomsVerificationResult CustomsVerificationResult { get; set; }
    public required ExportedGoodsStiAssessmentResult StiAssessmentResult { get; set; }
}