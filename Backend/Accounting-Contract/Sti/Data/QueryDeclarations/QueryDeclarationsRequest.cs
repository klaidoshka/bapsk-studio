namespace Accounting.Contract.Sti.Data.QueryDeclarations;

public class QueryDeclarationsRequest
{
    public string RequestId { get; set; }
    public DateTime TimeStamp { get; set; }
    public string SenderId { get; set; }
    public QueryDeclarationsQuery Query { get; set; }
}