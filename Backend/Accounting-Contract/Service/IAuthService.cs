using Accounting.Contract.Dto.Auth;

namespace Accounting.Contract.Service;

public interface IAuthService
{
    Task ChangePasswordAsync(ChangePasswordRequest request);
    
    Task<JwtTokenPair> LoginAsync(LoginRequest request);

    Task LogoutAsync(Guid sessionId);

    Task<JwtTokenPair> RefreshTokenAsync(string refreshToken);

    Task<JwtTokenPair> RegisterAsync(RegisterRequest request);
    
    Task ResetPasswordAsync(ResetPasswordRequest request);
}