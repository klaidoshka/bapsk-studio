using System.Collections.Immutable;
using Accounting.Contract.Dto.Sti;
using Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;
using Accounting.Contract.Entity;
using Accounting.Services.Util;

namespace Accounting.Services.Sti.Mapping;

public static class ExportedGoods
{
    public static getInfoOnExportedGoodsRequest ToExternalType(this ExportedGoodsRequest request)
    {
        return new getInfoOnExportedGoodsRequest
        {
            DocId = request.DocumentId,
            RequestId = request.RequestId,
            SenderIn = request.SenderId,
            TimeStamp = request.TimeStamp
        };
    }

    public static ExportedGoodsResponse ToInternalType(
        this getInfoOnExportedGoodsResponse1 response
    )
    {
        return new ExportedGoodsResponse
        {
            Errors = response.getInfoOnExportedGoodsResponse.Item is Errors_Type errors
                ? errors.Error.ToInternalType()
                : null,
            Info =
                response.getInfoOnExportedGoodsResponse.Item is InfoOnExportedGoods_Type goods
                    ? goods.ToInternalType()
                    : null,
            ResultDate = response.getInfoOnExportedGoodsResponse.ResultDate,
            ResultStatus = response.getInfoOnExportedGoodsResponse.ResultStatus
                .ConvertToEnum<ResultStatus>()
        };
    }

    private static ExportedGoodsInfo ToInternalType(this InfoOnExportedGoods_Type goods)
    {
        return new ExportedGoodsInfo
        {
            CustomsVerificationResult = goods.CustomsVerificationResults
                .ToInternalType(),
            StiAssessmentResult = goods.STIAssessmentResults.ToInternalType()
        };
    }

    private static ExportedGoodsCustomsVerificationResult ToInternalType(
        this CustomsVerificationResults_Type results
    )
    {
        return new ExportedGoodsCustomsVerificationResult
        {
            CorrectionDate = results.CorrectionDate,
            DocumentId = results.DocId,
            CustomsOfficeCode = results.CustomsOfficeCode,
            DocumentCorrectionNo = results.DocCorrNo,
            VerificationDate = results.VerificationDate,
            VerifiedGoods = results.VerifiedGoods.ToInternalType(),
            VerificationResult = results.VerificationResult
                .ConvertToEnum<ExportedGoodsCustomsVerificationResultType>()
        };
    }

    private static IReadOnlyList<ExportedGoodsVerifiedGoods> ToInternalType(
        this VerifiedGoods_Type[] goods
    )
    {
        return goods
            .Select(
                g => new ExportedGoodsVerifiedGoods
                {
                    GrossValueVerified = g.GrossValueVerified,
                    UnitOfMeasure = g.Item,
                    UnitOfMeasureType = g.ItemElementName.ConvertToEnum<UnitOfMeasureType>(),
                    Quantity = g.Quantity,
                    QuantityVerified = g.QuantityVerified,
                    SequenceNo = g.SequenceNo,
                    TotalAmount = g.TotalAmount
                }
            )
            .ToImmutableList();
    }

    private static ExportedGoodsStiAssessmentResult ToInternalType(
        this STIAssessmentResults_Type results
    )
    {
        return new ExportedGoodsStiAssessmentResult
        {
            AssessmentDate = results.AssessmentDate,
            Conditions = results.Condition.ToInternalType()
        };
    }

    private static IReadOnlyList<ExportedGoodsStiAssessmentResultCondition> ToInternalType(
        this STIAssessmentResults_TypeCondition[] conditions
    )
    {
        return conditions
            .Select(
                c => new ExportedGoodsStiAssessmentResultCondition
                {
                    Code = c.Code,
                    Description = c.Description,
                    Result = c.Result,
                    TotalAmountVerified = c.TotalAmountVerified
                }
            )
            .ToImmutableList();
    }
}