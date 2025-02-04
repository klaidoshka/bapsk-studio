namespace Accounting.Contract.Sti.Data;

public class CancelDeclarationRequest
{
    public string RequestId { get; set; }
    public DateTime TimeStamp { get; set; }
    public string SenderId { get; set; }
    public string DocumentId { get; set; }
}

public class CancelDeclarationResponse
{
    public ResultStatus ResultStatus { get; set; }
    public DateTime ResultDate { get; set; }
    public IReadOnlyList<StiApiError> Errors { get; set; }
}