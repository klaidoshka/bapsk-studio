using Accounting.Contract.Dto.Auth;

namespace Accounting.Contract.Service;

public interface IAuthService
{
    public Task ChangePasswordAsync(ChangePasswordRequest request);

    public Task<JwtTokenPair> LoginAsync(LoginRequest request);

    public Task LogoutAsync(Guid sessionId);

    public Task<JwtTokenPair> RefreshTokenAsync(string refreshToken);

    public Task<JwtTokenPair> RegisterAsync(RegisterRequest request);

    public Task ResetPasswordAsync(ResetPasswordRequest request);
}