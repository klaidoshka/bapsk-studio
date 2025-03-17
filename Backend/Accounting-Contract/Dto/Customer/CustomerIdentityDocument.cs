using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Customer;

public class CustomerIdentityDocument
{
    public IsoCountryCode IssuedBy { get; set; } = IsoCountryCode.LT;
    public string Number { get; set; } = String.Empty;
    public IdentityDocumentType Type { get; set; } = IdentityDocumentType.Passport;
    public string? Value { get; set; }
}