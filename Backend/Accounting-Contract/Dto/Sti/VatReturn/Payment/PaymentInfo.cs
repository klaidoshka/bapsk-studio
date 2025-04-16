using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Sti.VatReturn.Payment;

public class PaymentInfo
{
    public required decimal Amount { get; set; }
    public required DateTime Date { get; set; }
    public required PaymentType Type { get; set; }
}

public static class PaymentInfoExtensions
{
    public static PaymentInfo ToDto(this StiVatReturnDeclarationPayment payment)
    {
        return new PaymentInfo
        {
            Amount = payment.Amount,
            Date = payment.Date,
            Type = payment.Type
        };
    }
}