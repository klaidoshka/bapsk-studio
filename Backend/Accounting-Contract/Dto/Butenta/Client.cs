using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Butenta;

public class Client
{
    public DateTime? Date { get; set; }
    public string Code { get; set; }
    public string Country { get; set; }
    public string Name { get; set; }
    public string Vat { get; set; }
}

public static class ClientExtensions
{
    public static Entity.Customer ToEntity(this Client client, IsoCountryCode country)
    {
        var hasVatPayerCode = !String.IsNullOrWhiteSpace(client.Vat);

        return new Entity.Customer
        {
            Birthdate = client.Date ?? DateTime.MinValue,
            FirstName = "-",
            IdentityDocumentNumber = hasVatPayerCode
                ? client.Vat
                : client.Code,
            IdentityDocumentIssuedBy = country,
            IdentityDocumentType = hasVatPayerCode
                ? IdentityDocumentType.Passport
                : IdentityDocumentType.NationalId,
            LastName = client.Name
        };
    }
}