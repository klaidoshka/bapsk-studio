#region

using Accounting.Contract.Entity;

#endregion

namespace Accounting.Contract.Dto;

public class User
{
    public DateTime BirthDate { get; set; }
    public IsoCountryCode Country { get; set; }
    public string Email { get; set; }
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public Role Role { get; set; }
}

public class UserIdentity
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}

public static class UserMappings
{
    public static User ToDto(this Entity.User entity)
    {
        return new User
        {
            BirthDate = entity.BirthDate,
            Country = entity.Country,
            Email = entity.Email,
            Id = entity.Id,
            FirstName = entity.FirstName,
            LastName = entity.LastName,
            Role = entity.Role
        };
    }
    
    public static UserIdentity ToIdentityDto(this Entity.User entity)
    {
        return new UserIdentity
        {
            Id = entity.Id,
            FirstName = entity.FirstName,
            LastName = entity.LastName
        };
    }
}