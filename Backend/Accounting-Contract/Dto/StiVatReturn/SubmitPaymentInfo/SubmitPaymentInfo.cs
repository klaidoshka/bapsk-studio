namespace Accounting.Contract.Dto.StiVatReturn.SubmitPaymentInfo;

public class SubmitPaymentInfo
{
    /// <summary>
    ///     Amount of payment made (minus any fees for the VAT return service).
    /// </summary>
    public required decimal Amount { get; set; }

    /// <summary>
    ///     When the payment was made.
    /// </summary>
    public DateTime Date { get; set; }

    /// <summary>
    ///     Return payment type.
    /// </summary>
    public required SubmitPaymentInfoType Type { get; set; }
}