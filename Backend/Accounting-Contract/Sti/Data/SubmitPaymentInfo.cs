namespace Accounting.Contract.Sti.Data;

public class SubmitPaymentInfoRequest
{
    public string RequestId { get; set; }
    public DateTime TimeStamp { get; set; }
    public string SenderId { get; set; }
    public string DocumentId { get; set; }
    public IReadOnlyList<PaymentInfo> PaymentInfo { get; set; }
}

public class SubmitPaymentInfoResponse
{
    public ResultStatus ResultStatus { get; set; }
    public DateTime ResultDate { get; set; }
    public ulong TransmissionId { get; set; }
    public bool TransmissionIdSpecified { get; set; }
    public IReadOnlyList<StiApiError> Errors { get; set; }
}

public class PaymentInfo
{
    public PaymentType PaymentType { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; }
    public DateTime PaymentDate { get; set; }
}

public enum PaymentType
{
    Item1,
    Item2,
    Item3
}