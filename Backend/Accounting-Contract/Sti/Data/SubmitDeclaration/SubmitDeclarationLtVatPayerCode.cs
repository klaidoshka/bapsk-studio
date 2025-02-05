namespace Accounting.Contract.Sti.Data.SubmitDeclaration;

public class SubmitDeclarationLtVatPayerCode
{
    public IsoCountryCode IssuedBy { get; set; } = IsoCountryCode.LT;
    public string Value { get; set; }
}