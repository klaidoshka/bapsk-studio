using Accounting.Contract.Entity;

namespace Accounting.Contract.Service;

public interface IJwtService
{
    public Task<Session?> ExtractSessionAsync(string token);

    public Guid? ExtractSessionId(string token);

    public string GenerateAccessToken(User user, Guid sessionId);

    public string GenerateRefreshToken(User user, Guid sessionId);

    public bool IsTokenValid(string token);
}