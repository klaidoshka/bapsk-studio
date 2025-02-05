namespace Accounting.Contract.Sti.Data.ExportedGoods;

public class ExportedGoodsStiAssessmentResult
{
    public DateTime AssessmentDate { get; set; }
    public IReadOnlyList<ExportedGoodsStiAssessmentResultCondition> Conditions { get; set; }
}