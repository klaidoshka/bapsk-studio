using Accounting.Contract.Enumeration;

namespace Accounting.Contract.Request;

public class UserEditRequest
{
    public DateTime BirthDate { get; set; }
    public IsoCountryCode Country { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public int UserId { get; set; }
    public string LastName { get; set; }
}