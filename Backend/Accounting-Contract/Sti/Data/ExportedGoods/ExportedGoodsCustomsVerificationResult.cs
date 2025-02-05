namespace Accounting.Contract.Sti.Data.ExportedGoods;

public class ExportedGoodsCustomsVerificationResult
{
    public string DocumentId { get; set; }
    public string DocumentCorrectionNo { get; set; }
    public DateTime VerificationDate { get; set; }
    public ExportedGoodsCustomsVerificationResultType VerificationResult { get; set; }
    public string CustomsOfficeCode { get; set; }
    public DateTime CorrectionDate { get; set; }
    public IReadOnlyList<ExportedGoodsVerifiedGoods> VerifiedGoods { get; set; }
}