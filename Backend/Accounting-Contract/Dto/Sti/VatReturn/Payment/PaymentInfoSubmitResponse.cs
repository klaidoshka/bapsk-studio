namespace Accounting.Contract.Dto.Sti.VatReturn.Payment;

public class PaymentInfoSubmitResponse
{
    public IList<StiError>? Errors { get; set; }
    public required DateTime ResultDate { get; set; }
    public required ResultStatus ResultStatus { get; set; }
}