using Accounting.Contract.Enumeration;

namespace Accounting.Services.Entity;

public class User
{
    public required DateTime BirthDate { get; set; }
    public required IsoCountryCode Country { get; set; }
    public required string Email { get; set; }
    public required string EmailNormalized { get; set; }
    public required Guid Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string PasswordHash { get; set; }
}