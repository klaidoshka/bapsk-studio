namespace Accounting.Contract.Dto.StiVatReturn.SubmitPaymentInfo;

/// <summary>
///     Request to submit AVT received refund/payment information.
///     If refund was received in parts, then each part can be submitted
///     in one request or separate requests.
/// </summary>
public class SubmitPaymentInfoRequest
{
    /// <summary>
    ///     Unique declaration identifier, 34 characters.
    /// </summary>
    public required string DocumentId { get; set; }

    /// <summary>
    ///     Information regarding the received refund/payment for submitted
    ///     tax-free declaration.
    /// </summary>
    public required IReadOnlyList<SubmitPaymentInfo> PaymentInfo { get; set; }

    /// <summary>
    ///     Request unique identifier, 36 characters.
    /// </summary>
    public required string RequestId { get; set; }

    /// <summary>
    ///     Service consumer identification number. It may be
    ///     seller or intermediary's identification number.
    ///     9 characters for individuals,
    ///     10 characters for Sti identification number,
    ///     10 characters for foreigner identification number,
    ///     6-8 characters for individuals of individual activity identification number
    /// </summary>
    public required string SenderId { get; set; }

    /// <summary>
    ///     When the request was created, yyyy-MM-ddTHH:mm:ss.
    /// </summary>
    public required DateTime TimeStamp { get; set; }
}