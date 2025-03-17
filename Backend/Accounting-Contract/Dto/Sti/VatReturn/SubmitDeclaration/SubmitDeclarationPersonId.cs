#region

using Accounting.Contract.Entity;

#endregion

namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclarationPersonId
{
    /// <summary>
    ///     Which country issued the document, 2 character ISO country code.
    /// </summary>
    public required IsoCountryCode IssuedBy { get; set; }

    /// <summary>
    ///     Identification number.
    /// </summary>
    public required string Value { get; set; }
}