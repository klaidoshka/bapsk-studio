namespace Accounting.Contract.Sti.ExportedGoods;

public class ExportedGoodsStiAssessmentResult
{
    /// <summary>
    /// Date-time of assessment, yyyy-MM-ddTHH:mm:ss.
    /// </summary>
    public required DateTime AssessmentDate { get; set; }

    /// <summary>
    /// Conditions that were assessed.
    /// </summary>
    public required IReadOnlyList<ExportedGoodsStiAssessmentResultCondition> Conditions { get; set; }
}