namespace Accounting.Contract.Sti.Data;

public class QueryDeclarationsRequest
{
    public required string RequestId { get; set; }
    public required DateTime TimeStamp { get; set; }
    public required string SenderIn { get; set; }
    public required Query Query { get; set; }
}

public class Query
{
    public required string DocumentId { get; set; }
    public required DateTime StateDateFrom { get; set; }
    public required bool StateDateFromSpecified { get; set; }
    public required DateTime StateDateTo { get; set; }
    public required bool StateDateToSpecified { get; set; }
    public required QueryDeclarationState DeclarationState { get; set; }
    public required bool DeclStateSpecified { get; set; }
}

public class QueryDeclarationsResponse
{
    public required ResultStatus ResultStatus { get; set; }
    public required DateTime ResultDate { get; set; }
    public required IReadOnlyList<StiApiError>? Errors { get; set; }
    public required IReadOnlyList<QueryDeclaration>? Declarations { get; set; }
}

public class QueryDeclaration
{
    public required string DocumentId { get; set; }
    public required string DocumentCorrectionNoLast { get; set; }
    public required string DocumentCorrectionNoCustoms { get; set; }
    public required QueryDeclarationState DeclarationState { get; set; }
    public required DateTime StateDate { get; set; }
}

public enum QueryDeclarationState
{
    ACCEPTED_CORRECT,
    ACCEPTED_INCORRECT,
    ASSESSED,
    REJECTED,
    CANCELLED
}