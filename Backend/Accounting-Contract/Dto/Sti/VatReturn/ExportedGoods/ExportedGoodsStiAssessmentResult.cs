namespace Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;

public class ExportedGoodsStiAssessmentResult
{
    public required DateTime AssessmentDate { get; set; }
    public required IList<ExportedGoodsStiAssessmentResultCondition> Conditions { get; set; }
}