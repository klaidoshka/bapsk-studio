#region

using Accounting.Contract.Entity;

#endregion

namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclarationIdDocumentNo
{
    public required IsoCountryCode IssuedBy { get; set; }
    public required string Value { get; set; }
}