namespace Accounting.Contract.Sti.Data;

public class QueryDeclarationsRequest
{
    public string RequestId { get; set; }
    public DateTime TimeStamp { get; set; }
    public string SenderId { get; set; }
    public Query Query { get; set; }
}

public class Query
{
    public string? DocumentId { get; set; }
    public DateTime? StateDateFrom { get; set; }
    public DateTime? StateDateTo { get; set; }
    public QueryDeclarationState? DeclarationState { get; set; }
}

public class QueryDeclarationsResponse
{
    public ResultStatus ResultStatus { get; set; }
    public DateTime ResultDate { get; set; }
    public IReadOnlyList<StiApiError>? Errors { get; set; }
    public IReadOnlyList<QueryDeclaration>? Declarations { get; set; }
}

public class QueryDeclaration
{
    public string DocumentId { get; set; }
    public string DocumentCorrectionNoLast { get; set; }
    public string DocumentCorrectionNoCustoms { get; set; }
    public QueryDeclarationState DeclarationState { get; set; }
    public DateTime StateDate { get; set; }
}

public enum QueryDeclarationState
{
    ACCEPTED_CORRECT,
    ACCEPTED_INCORRECT,
    ASSESSED,
    REJECTED,
    CANCELLED
}