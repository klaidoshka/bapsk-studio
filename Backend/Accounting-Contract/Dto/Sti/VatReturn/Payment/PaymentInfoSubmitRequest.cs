namespace Accounting.Contract.Dto.Sti.VatReturn.Payment;

public class PaymentInfoSubmitRequest
{
    public required string DocumentId { get; set; }
    public required IList<PaymentInfo> Payments { get; set; }
    public required string RequestId { get; set; }
    public required string SenderId { get; set; }
    public required DateTime TimeStamp { get; set; }
}