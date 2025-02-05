namespace Accounting.Contract.Sti.Data.SubmitPaymentInfo;

public class SubmitPaymentInfoRequest
{
    public string RequestId { get; set; }
    public DateTime TimeStamp { get; set; }
    public string SenderId { get; set; }
    public string DocumentId { get; set; }
    public IReadOnlyList<SubmitPaymentInfo> PaymentInfo { get; set; }
}