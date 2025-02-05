namespace Accounting.Contract.Sti.Data.QueryDeclarations;

public class QueryDeclarationsDeclaration
{
    public string DocumentId { get; set; }
    public string DocumentCorrectionNoLast { get; set; }
    public string DocumentCorrectionNoCustoms { get; set; }
    public QueryDeclarationsState DeclarationState { get; set; }
    public DateTime StateDate { get; set; }
}