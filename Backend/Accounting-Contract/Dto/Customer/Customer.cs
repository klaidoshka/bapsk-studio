using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Customer;

public class Customer
{
    public DateTime Birthdate { get; set; } = DateTime.UtcNow;
    public string? Email { get; set; }
    public string FirstName { get; set; } = String.Empty;
    public int? Id { get; set; }
    public CustomerIdentityDocument IdentityDocument { get; set; } = new();
    public string LastName { get; set; } = String.Empty;
    public IList<CustomerOtherDocument> OtherDocuments { get; set; } = new List<CustomerOtherDocument>();
    public IsoCountryCode ResidenceCountry { get; set; } = IsoCountryCode.LT;
}

public static class CustomerExtensions
{
    public static Customer ToDto(this Entity.Customer customer)
    {
        return new Customer
        {
            Birthdate = customer.Birthdate,
            Email = customer.Email,
            FirstName = customer.FirstName,
            Id = customer.Id,
            IdentityDocument = new CustomerIdentityDocument
            {
                IssuedBy = customer.IdentityDocumentIssuedBy,
                Number = customer.IdentityDocumentNumber,
                Type = customer.IdentityDocumentType,
                Value = customer.IdentityDocumentValue
            },
            LastName = customer.LastName,
            OtherDocuments = customer.OtherDocuments
                .Select(it => it.ToDto())
                .ToList(),
            ResidenceCountry = customer.ResidenceCountry
        };
    }

    public static Entity.Customer ToEntity(this Customer customer)
    {
        return new Entity.Customer
        {
            Birthdate = customer.Birthdate,
            Email = customer.Email,
            FirstName = customer.FirstName,
            Id = customer.Id ?? 0,
            IdentityDocumentIssuedBy = customer.IdentityDocument.IssuedBy,
            IdentityDocumentNumber = customer.IdentityDocument.Number,
            IdentityDocumentType = customer.IdentityDocument.Type,
            IdentityDocumentValue = customer.IdentityDocument.Value,
            LastName = customer.LastName,
            OtherDocuments = customer.OtherDocuments
                .Select(it => it.ToEntity())
                .ToList(),
            ResidenceCountry = customer.ResidenceCountry
        };
    }
}