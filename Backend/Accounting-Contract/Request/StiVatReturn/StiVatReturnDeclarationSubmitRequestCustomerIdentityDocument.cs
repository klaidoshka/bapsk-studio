using Accounting.Contract.Dto.StiVatReturn;
using Accounting.Contract.Entity;

namespace Accounting.Contract.Request.StiVatReturn;

public class StiVatReturnDeclarationSubmitRequestCustomerIdentityDocument
{
    public IsoCountryCode IssuedBy { get; set; } = IsoCountryCode.LT;
    public IdentityDocumentType Type { get; set; } = IdentityDocumentType.Passport;
    public string Value { get; set; } = String.Empty;
}