using System.Collections.Immutable;
using Account.Services;
using Accounting.Contract.Sti;
using Accounting.Contract.Sti.Data;
using Accounting.Services.Util;

namespace Accounting.Services.Sti.Mapping;

public static class ExportedGoods
{
    public static getInfoOnExportedGoodsRequest ToExternalType(this ExportedGoodsRequest request)
    {
        return new getInfoOnExportedGoodsRequest
        {
            DocId = request.DocId,
            RequestId = request.RequestId,
            SenderIn = request.SenderIn,
            TimeStamp = request.TimeStamp
        };
    }

    public static ExportedGoodsResponse ToInternalType(
        this getInfoOnExportedGoodsResponse1 response)
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
            StiAssessmentResult = goods.STIAssessmentResults.ToInternalType(),
        };
    }

    private static CustomsVerificationResult ToInternalType(
        this CustomsVerificationResults_Type results
    )
    {
        return new CustomsVerificationResult
        {
            CorrectionDate = results.CorrectionDate,
            DocumentId = results.DocId,
            CorrectionDateSpecified = results.CorrectionDateSpecified,
            CustomsOfficeCode = results.CustomsOfficeCode,
            DocumentCorrectionNo = results.DocCorrNo,
            VerificationDate = results.VerificationDate,
            VerifiedGoods = results.VerifiedGoods.ToInternalType(),
            VerificationResult = results.VerificationResult
                .ConvertToEnum<CustomsVerificationResultType>()
        };
    }

    private static IReadOnlyList<VerifiedGoods> ToInternalType(this VerifiedGoods_Type[] goods)
    {
        return goods
            .Select(g => new VerifiedGoods
            {
                GrossValueVerified = g.GrossValueVerified,
                Item = g.Item,
                ItemElementName = g.ItemElementName.ConvertToEnum<ItemChoice>(),
                Quantity = g.Quantity,
                QuantityVerified = g.QuantityVerified,
                SequenceNo = g.SequenceNo,
                TotalAmount = g.TotalAmount
            })
            .ToImmutableList();
    }

    private static StiAssessmentResult ToInternalType(this STIAssessmentResults_Type results)
    {
        return new StiAssessmentResult
        {
            AssessmentDate = results.AssessmentDate,
            Conditions = results.Condition.ToInternalType()
        };
    }

    private static IReadOnlyList<StiAssessmentResultCondition> ToInternalType(
        this STIAssessmentResults_TypeCondition[] conditions
    )
    {
        return conditions
            .Select(c => new StiAssessmentResultCondition
            {
                Code = c.Code,
                Description = c.Description,
                Result = c.Result,
                TotalAmountVerified = c.TotalAmountVerified,
                TotalAmountVerifiedSpecified = c.TotalAmountVerifiedSpecified
            })
            .ToImmutableList();
    }
}