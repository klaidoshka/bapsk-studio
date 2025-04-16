namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclaration
{
    public required SubmitDeclarationCustomer Customer { get; set; }
    public required SubmitDeclarationDocumentHeader Header { get; set; }
    public SubmitDeclarationIntermediary Intermediary { get; set; }
    public required SubmitDeclarationSalesman Salesman { get; set; }
    public required IReadOnlyList<SubmitDeclarationSalesDocument> SalesDocuments { get; set; }
}