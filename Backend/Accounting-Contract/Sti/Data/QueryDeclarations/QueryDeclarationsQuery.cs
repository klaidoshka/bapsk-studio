namespace Accounting.Contract.Sti.Data.QueryDeclarations;

public class QueryDeclarationsQuery
{
    public string? DocumentId { get; set; }
    public DateTime? StateDateFrom { get; set; }
    public DateTime? StateDateTo { get; set; }
    public QueryDeclarationsState? DeclarationState { get; set; }
}