#region

using Accounting.Contract.Entity;

#endregion

namespace Accounting.Contract.Dto.StiVatReturn.SubmitDeclaration;

public class SubmitDeclarationOtherDocumentNo
{
    /// <summary>
    ///     Which country issued the document.
    /// </summary>
    public required IsoCountryCode IssuedBy { get; set; }

    /// <summary>
    ///     Number of the document, 50 characters.
    /// </summary>
    public required string Value { get; set; }
}