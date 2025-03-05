using Accounting.Contract;
using Accounting.Contract.Entity;
using Accounting.Contract.Request;
using Accounting.Contract.Response;
using Accounting.Contract.Service;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class UserService : IUserService
{
    private readonly AccountingDatabase _database;
    private readonly IHashService _hashService;

    public UserService(AccountingDatabase database, IHashService hashService)
    {
        _database = database;
        _hashService = hashService;
    }

    public async Task<User> CreateAsync(UserCreateRequest request)
    {
        var user = new User
        {
            BirthDate = request.BirthDate,
            Country = request.Country,
            Email = request.Email,
            EmailNormalized = request.Email.ToLowerInvariant(),
            FirstName = request.FirstName,
            IsDeleted = false,
            LastName = request.LastName,
            PasswordHash = _hashService.Hash(request.Password)
        };

        user = (await _database.Users.AddAsync(user)).Entity;

        await _database.SaveChangesAsync();

        return user;
    }

    public async Task DeleteAsync(int id)
    {
        var user = await _database.Users.FindAsync(id)
                   ?? throw new ValidationException("User not found.");

        if (user.IsDeleted)
        {
            return;
        }

        user.IsDeleted = true;

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(UserEditRequest request)
    {
        var user = await _database.Users.FindAsync(request.Id);

        if (user == null || user.IsDeleted)
        {
            throw new ValidationException("User not found.");
        }

        user.BirthDate = request.BirthDate;
        user.Country = request.Country;
        user.Email = request.Email;
        user.EmailNormalized = request.Email.ToLowerInvariant();
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;

        await _database.SaveChangesAsync();
    }

    public async Task<User> GetAsync(int id)
    {
        var user = await _database.Users.FindAsync(id);

        if (user == null || user.IsDeleted)
        {
            throw new ValidationException("User not found.");
        }

        return user;
    }

    public async Task<User> GetByEmailAsync(string email)
    {
        var user = await _database.Users.FirstOrDefaultAsync(
            u => u.EmailNormalized.Equals(
                email,
                StringComparison.InvariantCultureIgnoreCase
            )
        );

        if (user == null || user.IsDeleted)
        {
            throw new ValidationException("User not found.");
        }

        return user;
    }
}