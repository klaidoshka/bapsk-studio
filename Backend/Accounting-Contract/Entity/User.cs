using Accounting.Contract.Enumeration;

namespace Accounting.Contract.Entity;

public class User
{
    public DateTime BirthDate { get; set; }

    public IsoCountryCode Country { get; set; }

    public string Email { get; set; }

    public string EmailNormalized { get; set; }

    public Guid Id { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string PasswordHash { get; set; }
}