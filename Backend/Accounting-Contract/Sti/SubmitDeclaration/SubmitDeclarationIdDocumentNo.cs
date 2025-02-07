using Accounting.Contract.Enumeration;

namespace Accounting.Contract.Sti.SubmitDeclaration;

public class SubmitDeclarationIdDocumentNo
{
    /// <summary>
    /// Which country issued the document.
    /// </summary>
    public required IsoCountryCode IssuedBy { get; set; }

    /// <summary>
    /// Number of the document.
    /// </summary>
    public required string Value { get; set; }
}