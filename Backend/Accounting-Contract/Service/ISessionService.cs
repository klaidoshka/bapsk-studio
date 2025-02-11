using Accounting.Contract.Entity;

namespace Accounting.Contract.Service;

public interface ISessionService
{
    /// <summary>
    /// Get a session by id.
    /// </summary>
    /// <param name="id">Session to get id</param>
    /// <returns>Session if found</returns>
    public Task<Session> GetAsync(Guid id);

    /// <summary>
    /// Get all sessions for a user.
    /// </summary>
    /// <param name="userId">User id to get sessions for</param>
    /// <returns>Session of the provided user</returns>
    public Task<IEnumerable<Session>> GetByUserIdAsync(int userId);
}