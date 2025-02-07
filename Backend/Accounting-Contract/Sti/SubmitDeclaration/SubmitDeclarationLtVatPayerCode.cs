using Accounting.Contract.Enumeration;

namespace Accounting.Contract.Sti.SubmitDeclaration;

public class SubmitDeclarationLtVatPayerCode
{
    /// <summary>
    /// Country code that issued this payer's VAT code.
    /// </summary>
    public required IsoCountryCode IssuedBy { get; set; } = IsoCountryCode.LT;

    /// <summary>
    /// Code of the VAT payer, 12 digits.
    /// </summary>
    public required string Value { get; set; }
}