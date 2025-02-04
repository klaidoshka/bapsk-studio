namespace Accounting.Contract.Sti.Data;

public class ExportedGoodsRequest
{
    public required string RequestId { get; set; }
    public required DateTime TimeStamp { get; set; }
    public required string SenderIn { get; set; }
    public required string DocId { get; set; }
}

public class ExportedGoodsResponse
{
    public required ResultStatus ResultStatus { get; set; }
    public required DateTime ResultDate { get; set; }
    public required IReadOnlyList<StiApiError>? Errors { get; set; }
    public required ExportedGoodsInfo? Info { get; set; }
}

public class ExportedGoodsInfo
{
    public required StiAssessmentResult StiAssessmentResult { get; set; }
    public required CustomsVerificationResult CustomsVerificationResult { get; set; }
}

public class StiAssessmentResult
{
    public required DateTime AssessmentDate { get; set; }
    public required IReadOnlyList<StiAssessmentResultCondition> Conditions { get; set; }
}

public class StiAssessmentResultCondition
{
    public required string Code { get; set; }
    public required string Description { get; set; }
    public required bool Result { get; set; }
    public required decimal TotalAmountVerified { get; set; }
    public required bool TotalAmountVerifiedSpecified { get; set; }
}

public class CustomsVerificationResult
{
    public required string DocumentId { get; set; }
    public required string DocumentCorrectionNo { get; set; }
    public required DateTime VerificationDate { get; set; }
    public required CustomsVerificationResultType VerificationResult { get; set; }
    public required string CustomsOfficeCode { get; set; }
    public required DateTime CorrectionDate { get; set; }
    public required bool CorrectionDateSpecified { get; set; }
    public required IReadOnlyList<VerifiedGoods> VerifiedGoods { get; set; }
}

public enum CustomsVerificationResultType
{
    A1,
    A4
}

public class VerifiedGoods
{
    public required string SequenceNo { get; set; }
    public required decimal TotalAmount { get; set; }
    public required decimal Quantity { get; set; }
    public required string Item { get; set; }
    public required ItemChoice ItemElementName { get; set; }
    public required decimal QuantityVerified { get; set; }
    public required decimal GrossValueVerified { get; set; }
}