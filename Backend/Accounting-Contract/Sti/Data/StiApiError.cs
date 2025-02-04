namespace Accounting.Contract.Sti.Data;

public class StiApiError
{
    public required string SequenceNo { get; set; }
    public required string ErrorCode { get; set; }
    public required string Description { get; set; }
    public required string Details { get; set; }
}