using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Butenta;

public class Client
{
    public DateTime? Birthdate { get; set; }
    public string Code { get; set; }
    public string Country { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
    public string Vat { get; set; }
}

public static class ClientExtensions
{
    public static Entity.Customer ToCustomerEntity(this Client client, IsoCountryCode country)
    {
        var hasVatPayerCode = !String.IsNullOrWhiteSpace(client.Vat);

        return new Entity.Customer
        {
            Birthdate = client.Birthdate ?? DateTime.Parse("1920-01-01"),
            FirstName = "-",
            Email = client.Email,
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

    public static Entity.Salesman ToSalesmanEntity(this Client client, IsoCountryCode country)
    {
        return new Entity.Salesman
        {
            Name = client.Name,
            VatPayerCode = client.Vat,
            VatPayerCodeIssuedBy = country
        };
    }
}