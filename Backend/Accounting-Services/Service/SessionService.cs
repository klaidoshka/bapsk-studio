using Accounting.Contract.Service;
using Accounting.Services.Entity;

namespace Accounting.Services.Service;

public class SessionService : ISessionService
{
    private readonly AccountingDatabase _database;

    public SessionService(AccountingDatabase database)
    {
        _database = database;
    }

    public async Task<Guid> CreateSessionAsync(Guid userId, string agent, string ipAddress, string location)
    {
        var session = new Session
        {
            Agent = agent,
            CreatedAt = DateTime.UtcNow,
            Id = Guid.NewGuid(),
            IpAddress = ipAddress,
            Location = location,
            UserId = userId
        };

        return (await _database.Sessions.AddAsync(session)).Entity.Id;
    }
}