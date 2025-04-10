using Accounting.Contract;
using Accounting.Contract.Dto.Session;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;
using Session = Accounting.Contract.Entity.Session;

namespace Accounting.Services.Service;

public class SessionService : ISessionService
{
    private readonly AccountingDatabase _database;
    private readonly ISessionValidator _sessionValidator;

    public SessionService(AccountingDatabase database, ISessionValidator sessionValidator)
    {
        _database = database;
        _sessionValidator = sessionValidator;
    }

    public async Task DeleteAsync(SessionDeleteRequest request)
    {
        (await _sessionValidator.ValidateSessionDeleteRequestAsync(request)).AssertValid();

        var session = await _database.Sessions.FirstAsync(s => s.Id == request.SessionId);

        _database.Sessions.Remove(session);

        await _database.SaveChangesAsync();
    }

    public async Task<Session> GetAsync(SessionGetRequest request)
    {
        (await _sessionValidator.ValidateSessionGetRequestAsync(request)).AssertValid();

        return (await _database.Sessions.FindAsync(request.SessionId))!;
    }

    public async Task<IList<Session>> GetByUserIdAsync(SessionGetByUserRequest request)
    {
        return await _database.Sessions
            .Where(s => s.UserId == request.RequesterId)
            .ToListAsync();
    }
}