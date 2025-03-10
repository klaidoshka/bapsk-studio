using Accounting.Contract.Request;
using Accounting.Contract.Response;

namespace Accounting.Contract.Validator;

public interface IUserValidator
{
    /// <summary>
    /// Validate whether user can be deleted.
    /// </summary>
    /// <param name="userId">User to delete</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateUserDeleteAsync(int userId);

    /// <summary>
    /// Validate if the requester can delete an user.
    /// </summary>
    /// <param name="requesterId">Requester</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateUserDeleteAuthorizationAsync(int requesterId);

    /// <summary>
    /// Validate whether user can be edited.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateUserEditAsync(UserEditRequest request);

    /// <summary>
    /// Validate if the requester can edit the user by id.
    /// </summary>
    /// <param name="requesterId">Requester</param>
    /// <param name="userId">User to edit</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateUserEditAuthorizationAsync(
        int requesterId,
        int userId
    );

    /// <summary>
    /// Validate whether user can be got by id.
    /// </summary>
    /// <param name="userId">User to get.</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateUserGetByIdAsync(int userId);

    /// <summary>
    /// Validate if the requester can get the user by id.
    /// </summary>
    /// <param name="requesterId">Requester</param>
    /// <param name="userId">User to get</param>
    /// <param name="onlyIdentity">Whether to get identity only</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateUserGetByIdAuthorizationAsync(
        int requesterId,
        int userId,
        bool onlyIdentity = false
    );
}