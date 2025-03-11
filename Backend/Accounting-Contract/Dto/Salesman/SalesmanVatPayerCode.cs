using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Salesman;

public class SalesmanVatPayerCode
{
    public IsoCountryCode IssuedBy { get; set; } = IsoCountryCode.LT;
    public string Value { get; set; } = String.Empty;
}