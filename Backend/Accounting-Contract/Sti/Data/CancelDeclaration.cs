namespace Accounting.Contract.Sti.Data;

public class CancelDeclarationRequest
{
    public required string RequestId { get; set; }
    public required DateTime TimeStamp { get; set; }
    public required string SenderId { get; set; }
    public required string DocumentId { get; set; }
}

public class CancelDeclarationResponse
{
    public required ResultStatus ResultStatus { get; set; }
    public required DateTime ResultDate { get; set; }
    public required IReadOnlyList<StiApiError> Errors { get; set; }
}