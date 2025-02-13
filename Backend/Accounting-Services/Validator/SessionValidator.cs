using Accounting.Contract;
using Accounting.Contract.Request;
using Accounting.Contract.Response;
using Accounting.Contract.Validator;

namespace Accounting.Services.Validator;

public class SessionValidator : ISessionValidator
{
    private readonly AccountingDatabase _database;

    public SessionValidator(AccountingDatabase database)
    {
        _database = database;
    }

    public async Task<Validation> ValidateSessionGetRequestAsync(SessionGetRequest request)
    {
        var session = await _database.Sessions.FindAsync(request.SessionId);

        if (session == null)
        {
            return new Validation("Session not found.");
        }

        return session.UserId != request.RequesterId
            ? new Validation("Session does not belong to you.")
            : new Validation();
    }
}