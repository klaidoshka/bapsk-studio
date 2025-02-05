namespace Accounting.Contract.Sti.Data.SubmitDeclaration;

public class SubmitDeclaration
{
    public SubmitDeclarationCustomer Customer { get; set; }
    public SubmitDeclarationDocumentHeader Header { get; set; }
    public SubmitDeclarationSalesman Salesman { get; set; }
    public IReadOnlyList<SubmitDeclarationSalesDocument> SalesDocuments { get; set; }
    public SubmitDeclarationIntermediary Intermediary { get; set; }
}