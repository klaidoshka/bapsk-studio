using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;

public class ExportedGoodsStiAssessmentResultCondition
{
    public required string Code { get; set; }
    public required string Description { get; set; }
    public required bool IsMet { get; set; }
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