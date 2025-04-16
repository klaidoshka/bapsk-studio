namespace Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;

public class ExportedGoodsStiAssessmentResult
{
    public required DateTime AssessmentDate { get; set; }
    public required IReadOnlyList<ExportedGoodsStiAssessmentResultCondition> Conditions { get; set; }
}