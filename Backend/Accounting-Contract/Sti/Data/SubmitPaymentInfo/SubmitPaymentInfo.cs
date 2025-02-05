namespace Accounting.Contract.Sti.Data.SubmitPaymentInfo;

public class SubmitPaymentInfo
{
    public SubmitPaymentInfoType PaymentType { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; }
    public DateTime PaymentDate { get; set; }
}