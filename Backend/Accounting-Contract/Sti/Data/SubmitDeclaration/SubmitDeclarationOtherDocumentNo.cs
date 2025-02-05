namespace Accounting.Contract.Sti.Data.SubmitDeclaration;

public class SubmitDeclarationOtherDocumentNo
{
    /// <summary>
    /// Which country issued the document.
    /// </summary>
    public required IsoCountryCode IssuedBy { get; set; }

    /// <summary>
    /// Number of the document, 50 characters.
    /// </summary>
    public required string Value { get; set; }
}