using Accounting.Contract.Entity;
using Accounting.Contract.Request;

namespace Accounting.Contract.Service;

public interface IUserService
{
    /// <summary>
    /// Creates a new user. Either by registration or by admin.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Created user</returns>
    public Task<User> CreateAsync(UserCreateRequest request);

    /// <summary>
    /// Deletes user by their id. Only admin or user themselves can delete user.
    /// Authorization is done before calling this method.
    /// </summary>
    /// <param name="userId">User id to delete</param>
    public Task DeleteAsync(int userId);

    /// <summary>
    /// Edits a user by request. Only admin or user themselves can edit user.
    /// Authorization is done before calling this method.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task EditAsync(UserEditRequest request);

    /// <summary>
    /// Gets users that can be accessed by requester.
    /// Admin gets all users.
    /// Other users get users accessible by instances they are in.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns></returns>
    public Task<IEnumerable<User>> GetAsync(UserGetRequest request);

    /// <summary>
    /// Gets user by id. Admin can get any user, but other users can only get users
    /// accessible by instances they are in or, if only partial user information is needed,
    /// all users. Authorization is done before calling this method.
    /// </summary>
    /// <param name="userId">User to get</param>
    /// <returns>User</returns>
    public Task<User> GetByIdAsync(int userId);
}