namespace Accounting.Contract.Sti.Data.QueryDeclarations;

public class QueryDeclarationsResponse
{
    public ResultStatus ResultStatus { get; set; }
    public DateTime ResultDate { get; set; }
    public IReadOnlyList<StiError>? Errors { get; set; }
    public IReadOnlyList<QueryDeclarationsDeclaration>? Declarations { get; set; }
}