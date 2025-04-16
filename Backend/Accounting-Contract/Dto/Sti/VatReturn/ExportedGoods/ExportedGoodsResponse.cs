using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;

public class ExportedGoodsResponse
{
    public required IList<StiError>? Errors { get; set; }
    public required ExportedGoodsInfo? Info { get; set; }
    public required DateTime ResultDate { get; set; }
    public required ResultStatus ResultStatus { get; set; }
}

public static class ExportedGoodsResponseExtensions
{
    public static StiVatReturnDeclarationExport ToEntity(this ExportedGoodsResponse response)
    {
        return new StiVatReturnDeclarationExport
        {
            AssessmentDate = response.Info!.StiAssessmentResult.AssessmentDate,
            Conditions = response.Info.StiAssessmentResult.Conditions
                .Select(it => it.ToEntity())
                .ToList(),
            CorrectionDate = response.Info.CustomsVerificationResult.CorrectionDate,
            CustomsOfficeCode = response.Info.CustomsVerificationResult.CustomsOfficeCode,
            DeclarationCorrectionNo = response.Info.CustomsVerificationResult.DocumentCorrectionNo,
            VerificationDate = response.Info.CustomsVerificationResult.VerificationDate,
            VerificationResult = response.Info.CustomsVerificationResult.VerificationResult,
            VerifiedSoldGoods = response.Info.CustomsVerificationResult.VerifiedGoods
                .Select(it => it.ToEntity())
                .ToList()
        };
    }
}