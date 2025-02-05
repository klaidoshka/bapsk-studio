using Accounting.Services.Entity;

namespace Accounting.Contract.Service;

public interface IUserService
{
    /// <summary>
    /// Gets user by specified id.
    /// </summary>
    /// <param name="userId">User id to get</param>
    /// <returns>In-progress task that resolves into user</returns>
    Task<User?> GetUserByIdAsync(Guid userId);

    /// <summary>
    /// Gets user by specified email.
    /// </summary>
    /// <param name="email">User email to get</param>
    /// <returns>In-progress task that resolves into user</returns>
    Task<User?> GetUserByEmailAsync(string email);
}