namespace Accounting.Contract.Sti.Data;

public class SubmitPaymentInfoRequest
{
    public required string RequestId { get; set; }
    public required DateTime TimeStamp { get; set; }
    public required string SenderId { get; set; }
    public required string DocumentId { get; set; }
    public required IReadOnlyList<PaymentInfo> PaymentInfo { get; set; }
}

public class SubmitPaymentInfoResponse
{
    public required ResultStatus ResultStatus { get; set; }
    public required DateTime ResultDate { get; set; }
    public required ulong TransmissionId { get; set; }
    public required bool TransmissionIdSpecified { get; set; }
    public required IReadOnlyList<StiApiError> Errors { get; set; }
}

public class PaymentInfo
{
    public required PaymentType PaymentType { get; set; }
    public required decimal Amount { get; set; }
    public required string Currency { get; set; }
    public required DateTime PaymentDate { get; set; }
}

public enum PaymentType
{
    Item1,
    Item2,
    Item3
}