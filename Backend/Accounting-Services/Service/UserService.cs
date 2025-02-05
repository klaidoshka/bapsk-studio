using Accounting.Contract.Service;
using Accounting.Services.Entity;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class UserService : IUserService
{
    private readonly AccountingDatabase _database;

    public UserService(AccountingDatabase database)
    {
        _database = database;
    }

    public Task<User?> GetUserByIdAsync(Guid userId)
    {
        return _database.Users.FirstOrDefaultAsync(u => u.Id == userId);
    }

    public Task<User?> GetUserByEmailAsync(string email)
    {
        return _database.Users.FirstOrDefaultAsync(
            u => u.EmailNormalized.Equals(
                email,
                StringComparison.InvariantCultureIgnoreCase
            )
        );
    }
}