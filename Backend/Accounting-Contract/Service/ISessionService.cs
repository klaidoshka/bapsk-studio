using Accounting.Contract.Entity;
using Accounting.Contract.Request;

namespace Accounting.Contract.Service;

public interface ISessionService
{
    /// <summary>
    /// Get a session by id.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Session if found</returns>
    public Task<Session> GetAsync(SessionGetRequest request);

    /// <summary>
    /// Get all sessions for a user.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Session of the provided user</returns>
    public Task<IEnumerable<Session>> GetByUserIdAsync(SessionGetByUserRequest request);
}