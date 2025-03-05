namespace Accounting.Contract.Dto.StiVatReturn.SubmitDeclaration;

public class SubmitDeclarationOtherDocument
{
    /// <summary>
    ///     Number of the document.
    /// </summary>
    public required SubmitDeclarationOtherDocumentNo DocumentNo { get; set; }

    /// <summary>
    ///     Type of the document, 100 characters.
    /// </summary>
    public required string DocumentType { get; set; }
}