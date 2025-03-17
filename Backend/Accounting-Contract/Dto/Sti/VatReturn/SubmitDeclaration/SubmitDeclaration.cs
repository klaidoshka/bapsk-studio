namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclaration
{
    /// <summary>
    ///     Buyer in the context of the declaration document.
    /// </summary>
    public required SubmitDeclarationCustomer Customer { get; set; }

    /// <summary>
    ///     Header of the declaration document.
    /// </summary>
    public required SubmitDeclarationDocumentHeader Header { get; set; }

    /// <summary>
    ///     Intermediary of the declaration document.
    /// </summary>
    public SubmitDeclarationIntermediary Intermediary { get; set; }

    /// <summary>
    ///     Seller in the context of the declaration document.
    /// </summary>
    public required SubmitDeclarationSalesman Salesman { get; set; }

    /// <summary>
    ///     Sales documents that are being submitted for VAT return.
    /// </summary>
    public required IReadOnlyList<SubmitDeclarationSalesDocument> SalesDocuments { get; set; }
}