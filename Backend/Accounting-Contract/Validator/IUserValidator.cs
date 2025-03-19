using Accounting.Contract.Dto;
using Accounting.Contract.Dto.User;

namespace Accounting.Contract.Validator;

public interface IUserValidator
{
    public Task<Validation> ValidateUserDeleteAsync(int userId);

    public Task<Validation> ValidateUserDeleteAuthorizationAsync(int requesterId);

    public Task<Validation> ValidateUserEditAsync(UserEditRequest request);

    public Task<Validation> ValidateUserEditAuthorizationAsync(int requesterId, int userId);

    public Task<Validation> ValidateUserGetByIdAsync(int userId);

    public Task<Validation> ValidateUserGetByIdAuthorizationAsync(int requesterId, int userId, bool onlyIdentity = false);
}