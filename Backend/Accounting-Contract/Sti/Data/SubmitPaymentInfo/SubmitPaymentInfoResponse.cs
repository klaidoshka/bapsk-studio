namespace Accounting.Contract.Sti.Data.SubmitPaymentInfo;

public class SubmitPaymentInfoResponse
{
    public ResultStatus ResultStatus { get; set; }
    public DateTime ResultDate { get; set; }
    public ulong TransmissionId { get; set; }
    public bool TransmissionIdSpecified { get; set; }
    public IReadOnlyList<StiError> Errors { get; set; }
}