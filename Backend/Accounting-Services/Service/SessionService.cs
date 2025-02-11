using Accounting.Contract;
using Accounting.Contract.Entity;
using Accounting.Contract.Response;
using Accounting.Contract.Service;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class SessionService : ISessionService
{
    private readonly AccountingDatabase _database;

    public SessionService(AccountingDatabase database)
    {
        _database = database;
    }

    public async Task<Session> GetAsync(Guid id)
    {
        return await _database.Sessions.FindAsync(id)
               ?? throw new ValidationException("Session not found.");
    }

    public async Task<IEnumerable<Session>> GetByUserIdAsync(int userId)
    {
        return await _database.Sessions
            .Where(s => s.UserId == userId)
            .ToListAsync();
    }
}