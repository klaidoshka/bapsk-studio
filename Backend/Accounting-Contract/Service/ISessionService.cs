namespace Accounting.Contract.Service;

public interface ISessionService
{
    /// <summary>
    /// Create a new session for the user
    /// </summary>
    /// <param name="userId">User to create session for</param>
    /// <param name="agent">Used agent to create session (browser/program/...)</param>
    /// <param name="ipAddress">Ip address request was received from</param>
    /// <param name="location">Location at which request was received</param>
    /// <returns>In-progress task to create session</returns>
    Task<Guid> CreateSessionAsync(Guid userId, string agent, string ipAddress, string location);
}