namespace Accounting.Contract.Dto.Customer;

public class Customer
{
    public DateTime Birthdate { get; set; } = DateTime.UtcNow;
    public string FirstName { get; set; } = String.Empty;
    public int? Id { get; set; }

    public CustomerIdentityDocument IdentityDocument { get; set; } = new();

    public string LastName { get; set; } = String.Empty;
}

public static class CustomerExtensions
{
    public static Customer ToDto(this Entity.Customer customer)
    {
        return new Customer
        {
            Birthdate = customer.Birthdate,
            FirstName = customer.FirstName,
            Id = customer.Id,
            IdentityDocument = new CustomerIdentityDocument
            {
                IssuedBy = customer.IdentityDocumentIssuedBy,
                Type = customer.IdentityDocumentType,
                Value = customer.IdentityDocument
            },
            LastName = customer.LastName
        };
    }

    public static Entity.Customer ToEntity(this Customer customer)
    {
        return new Entity.Customer
        {
            Birthdate = customer.Birthdate,
            FirstName = customer.FirstName,
            Id = customer.Id ?? 0,
            IdentityDocumentIssuedBy = customer.IdentityDocument.IssuedBy,
            IdentityDocumentType = customer.IdentityDocument.Type,
            IdentityDocument = customer.IdentityDocument.Value,
            LastName = customer.LastName
        };
    }
}