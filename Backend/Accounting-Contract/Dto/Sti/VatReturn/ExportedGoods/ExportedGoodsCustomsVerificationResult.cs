using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;

public class ExportedGoodsCustomsVerificationResult
{
    public DateTime? CorrectionDate { get; set; }
    public required string CustomsOfficeCode { get; set; }
    public required int DocumentCorrectionNo { get; set; }
    public required string DocumentId { get; set; }
    public required DateTime VerificationDate { get; set; }
    public required StiVatReturnDeclarationExportVerificationResult VerificationResult { get; set; }
    public required IList<ExportedGoodsVerifiedGoods> VerifiedGoods { get; set; }
}