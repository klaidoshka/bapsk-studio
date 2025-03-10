using Accounting.Contract.Entity;

namespace Accounting.Contract.Request.StiVatReturn;

public class StiVatReturnDeclarationSubmitRequestSalesmanVatPayerCode
{
    public IsoCountryCode IssuedBy { get; set; } = IsoCountryCode.LT;
    public string Value { get; set; } = String.Empty;
}