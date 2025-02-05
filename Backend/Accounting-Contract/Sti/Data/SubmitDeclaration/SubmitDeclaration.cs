namespace Accounting.Contract.Sti.Data.SubmitDeclaration;

public class SubmitDeclaration
{
    /// <summary>
    /// Buyer in the context of the declaration document.
    /// </summary>
    public SubmitDeclarationCustomer Customer { get; set; }

    /// <summary>
    /// Header of the declaration document.
    /// </summary>
    public SubmitDeclarationDocumentHeader Header { get; set; }

    /// <summary>
    /// Seller in the context of the declaration document.
    /// </summary>
    public SubmitDeclarationSalesman Salesman { get; set; }

    /// <summary>
    /// Sales documents that are being submitted for VAT return.
    /// </summary>
    public IReadOnlyList<SubmitDeclarationSalesDocument> SalesDocuments { get; set; }

    /// <summary>
    /// Intermediary of the declaration document.
    /// </summary>
    public SubmitDeclarationIntermediary Intermediary { get; set; }
}