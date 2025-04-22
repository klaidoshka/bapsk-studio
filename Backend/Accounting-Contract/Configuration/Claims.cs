using System.Security.Claims;

namespace Accounting.Contract.Configuration;

public static class Claims
{
    public static readonly string Role = ClaimTypes.Role;
    public static readonly string SessionId = "sessionId";
    public static readonly string UserId = ClaimTypes.NameIdentifier;
}