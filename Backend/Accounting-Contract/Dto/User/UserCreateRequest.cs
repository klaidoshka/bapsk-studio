using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.User;

public class UserCreateRequest
{
    public DateTime BirthDate { get; set; }
    public IsoCountryCode Country { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Password { get; set; }
}