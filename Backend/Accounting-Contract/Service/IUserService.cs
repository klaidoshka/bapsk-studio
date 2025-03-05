using Accounting.Contract.Entity;
using Accounting.Contract.Request;

namespace Accounting.Contract.Service;

// TODO: Address requester id
public interface IUserService
{
    /// <summary>
    /// Creates a new user.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Created user</returns>
    public Task<User> CreateAsync(UserCreateRequest request);

    /// <summary>
    /// Deletes user by id.
    /// </summary>
    /// <param name="id">User id to delete</param>
    public Task DeleteAsync(int id);

    /// <summary>
    /// Edits a user by request.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task EditAsync(UserEditRequest request);

    /// <summary>
    /// Gets user by id.
    /// </summary>
    /// <param name="id">Id to look user with</param>
    /// <returns>User</returns>
    public Task<User> GetAsync(int id);

    /// <summary>
    /// Gets user by email.
    /// </summary>
    /// <param name="email">Email to look user with</param>
    /// <returns>User</returns>
    public Task<User> GetByEmailAsync(string email);
}