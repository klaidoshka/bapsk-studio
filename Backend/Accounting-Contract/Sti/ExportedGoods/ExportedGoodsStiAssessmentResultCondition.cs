namespace Accounting.Contract.Sti.ExportedGoods;

public class ExportedGoodsStiAssessmentResultCondition
{
    /// <summary>
    /// Classification's code for the assessed condition, 4 characters.
    /// </summary>
    public required string Code { get; set; }

    /// <summary>
    /// Assessed condition's description in LT language, 300 characters.
    /// </summary>
    public required string Description { get; set; }

    /// <summary>
    /// Result of the condition assessment. Is it met or unmet.
    /// </summary>
    public required bool Result { get; set; }

    /// <summary>
    /// Total amount that was verified for the condition.
    /// </summary>
    public decimal TotalAmountVerified { get; set; }
}