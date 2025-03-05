namespace Accounting.Contract.Dto.StiVatReturn.SubmitPaymentInfo;

public class SubmitPaymentInfoResponse
{
    /// <summary>
    ///     Errors that occurred during the operation. Only exists if
    ///     operation is not successful.
    /// </summary>
    public IReadOnlyList<StiError>? Errors { get; set; }

    /// <summary>
    ///     Date-time of the response, yyyy-MM-ddTHH:mm:ss.
    /// </summary>
    public required DateTime ResultDate { get; set; }

    /// <summary>
    ///     Result of the operation.
    /// </summary>
    public required ResultStatus ResultStatus { get; set; }

    /// <summary>
    ///     Identifier of the transmission to Sti, 19 digits. Only exists
    ///     when the operation is successful.
    /// </summary>
    public ulong? TransmissionId { get; set; }
}