namespace Accounting.Contract.Sti.Data;

public class ExportedGoodsRequest
{
    public string RequestId { get; set; }
    public DateTime TimeStamp { get; set; }
    public string SenderId { get; set; }
    public string DocumentId { get; set; }
}

public class ExportedGoodsResponse
{
    public ResultStatus ResultStatus { get; set; }
    public DateTime ResultDate { get; set; }
    public IReadOnlyList<StiApiError>? Errors { get; set; }
    public ExportedGoodsInfo? Info { get; set; }
}

public class ExportedGoodsInfo
{
    public StiAssessmentResult StiAssessmentResult { get; set; }
    public CustomsVerificationResult CustomsVerificationResult { get; set; }
}

public class StiAssessmentResult
{
    public DateTime AssessmentDate { get; set; }
    public IReadOnlyList<StiAssessmentResultCondition> Conditions { get; set; }
}

public class StiAssessmentResultCondition
{
    public string Code { get; set; }
    public string Description { get; set; }
    public bool Result { get; set; }
    public decimal TotalAmountVerified { get; set; }
}

public class CustomsVerificationResult
{
    public string DocumentId { get; set; }
    public string DocumentCorrectionNo { get; set; }
    public DateTime VerificationDate { get; set; }
    public CustomsVerificationResultType VerificationResult { get; set; }
    public string CustomsOfficeCode { get; set; }
    public DateTime CorrectionDate { get; set; }
    public IReadOnlyList<VerifiedGoods> VerifiedGoods { get; set; }
}

public enum CustomsVerificationResultType
{
    A1,
    A4
}

public class VerifiedGoods
{
    public string SequenceNo { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal Quantity { get; set; }
    public string Item { get; set; }
    public ItemChoice ItemElementName { get; set; }
    public decimal QuantityVerified { get; set; }
    public decimal GrossValueVerified { get; set; }
}