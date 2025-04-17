using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Auth;
using Accounting.Contract.Entity;

namespace Accounting.Contract.Validator;

public interface IAuthValidator
{
    public Validation ValidateAuthMeta(AuthUserMeta meta);
    
    public Task<Validation<(User?, User?)>> ValidateChangePasswordRequestAsync(ChangePasswordRequest request);

    public Validation ValidateLoginRequest(LoginRequest request);

    public Task<Validation> ValidateRegisterRequestAsync(RegisterRequest request);

    public Task<Validation> ValidateRefreshTokenAsync(string refreshToken);

    public Task<Validation> ValidateUserCredentialsAsync(string email, string password);
    
    public Task<Validation<User>> ValidateResetPasswordAsync(ResetPasswordRequest request);
}