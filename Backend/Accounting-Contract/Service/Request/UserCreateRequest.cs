using Accounting.Contract.Enumeration;

namespace Accounting.Contract.Service.Request;

public class UserCreateRequest
{
    public DateTime BirthDate { get; set; }
    public IsoCountryCode Country { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Password { get; set; }
}