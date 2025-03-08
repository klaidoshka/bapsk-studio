using Accounting.Contract.Enumeration;

namespace Accounting.Contract.Dto.StiVatReturn;

public class Salesman
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string VatPayerCode { get; set; }

    public IsoCountryCode VatPayerCodeIssuedBy { get; set; } = IsoCountryCode.LT;
}