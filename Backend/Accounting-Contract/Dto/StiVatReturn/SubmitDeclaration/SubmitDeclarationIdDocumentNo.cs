#region

using Accounting.Contract.Enumeration;

#endregion

namespace Accounting.Contract.Dto.StiVatReturn.SubmitDeclaration;

public class SubmitDeclarationIdDocumentNo
{
    /// <summary>
    ///     Which country issued the document.
    /// </summary>
    public required IsoCountryCode IssuedBy { get; set; }

    /// <summary>
    ///     Number of the document.
    /// </summary>
    public required string Value { get; set; }
}