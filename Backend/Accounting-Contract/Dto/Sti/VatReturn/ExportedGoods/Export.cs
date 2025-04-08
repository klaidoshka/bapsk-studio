using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;

public class Export
{
    public DateTime AssessmentDate { get; set; }
    public ICollection<ExportedGoodsStiAssessmentResultCondition> Conditions { get; set; }
    public DateTime? CorrectionDate { get; set; }
    public string CustomsOfficeCode { get; set; }
    public int DeclarationCorrectionNo { get; set; }
    public int Id { get; set; }
    public DateTime VerificationDate { get; set; }
    public StiVatReturnDeclarationExportVerificationResult VerificationResult { get; set; }
    public ICollection<ExportedGoodsVerifiedGoods> VerifiedSoldGoods { get; set; }
}

public static class ExportExtensions
{
    public static Export ToDto(this StiVatReturnDeclarationExport export)
    {
        return new Export
        {
            AssessmentDate = export.AssessmentDate,
            Conditions = export.Conditions
                .Select(it => it.ToDto())
                .ToList(),
            CorrectionDate = export.CorrectionDate,
            CustomsOfficeCode = export.CustomsOfficeCode,
            DeclarationCorrectionNo = export.DeclarationCorrectionNo,
            Id = export.Id,
            VerificationDate = export.VerificationDate,
            VerificationResult = export.VerificationResult,
            VerifiedSoldGoods = export.VerifiedSoldGoods
                .Select(it => it.ToDto())
                .ToList()
        };
    }
}