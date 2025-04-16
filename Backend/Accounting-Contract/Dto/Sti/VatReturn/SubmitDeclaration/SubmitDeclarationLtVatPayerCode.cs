#region

using Accounting.Contract.Entity;

#endregion

namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclarationLtVatPayerCode
{
    public required IsoCountryCode IssuedBy { get; set; } = IsoCountryCode.LT;
    public required string Value { get; set; }
}