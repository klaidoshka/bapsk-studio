using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;

public class ExportedGoodsStiAssessmentResultCondition
{
    /// <summary>
    ///     Classification's code for the assessed condition, 4 characters.
    /// </summary>
    public required string Code { get; set; }

    /// <summary>
    ///     Assessed condition's description in LT language, 300 characters.
    /// </summary>
    public required string Description { get; set; }

    /// <summary>
    ///     Result of the condition assessment. Is it met or unmet.
    /// </summary>
    public required bool IsMet { get; set; }

    /// <summary>
    ///     Total amount that was verified for the condition.
    /// </summary>
    public decimal TotalAmountVerified { get; set; }
}

public static class ExportedGoodsStiAssessmentResultConditionExtensions
{
    public static ExportedGoodsStiAssessmentResultCondition ToDto(this StiVatReturnDeclarationExportAssessmentCondition condition)
    {
        return new ExportedGoodsStiAssessmentResultCondition
        {
            Code = condition.Code,
            Description = condition.Description,
            IsMet = condition.IsMet
        };
    }
    
    public static StiVatReturnDeclarationExportAssessmentCondition ToEntity(this ExportedGoodsStiAssessmentResultCondition condition)
    {
        return new StiVatReturnDeclarationExportAssessmentCondition
        {
            Code = condition.Code,
            Description = condition.Description,
            IsMet = condition.IsMet
        };
    }
}