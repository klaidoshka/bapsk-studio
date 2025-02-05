using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Accounting.Contract.Service;
using Accounting.Contract.Sti;
using Accounting.Services.Auth;
using Accounting.Services.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Accounting.Services.Service;

public class AuthService : IAuthService
{
    private readonly AccountingDatabase _database;
    private readonly IHashService _hashService;
    private readonly JwtSettings _jwtSettings;
    private readonly ISessionService _sessionService;
    private readonly IUserService _userService;

    public AuthService(
        AccountingDatabase database,
        IHashService hashService,
        JwtSettings jwtSettings,
        ISessionService sessionService,
        IUserService userService
    )
    {
        _database = database;
        _hashService = hashService;
        _jwtSettings = jwtSettings;
        _sessionService = sessionService;
        _userService = userService;
    }

    public async Task<JwtToken> LoginAsync(LoginRequest request)
    {
        var user = await _userService.GetUserByEmailAsync(request.Email);

        if (user == null || !await ValidateUserCredentialsAsync(request.Email, request.Password))
        {
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        var sessionId = await _sessionService.CreateSessionAsync(
            user.Id,
            request.Agent,
            request.IpAddress,
            request.Location
        );

        return new JwtToken
        {
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
            SessionId = sessionId,
            Token = GenerateJwtToken(user, sessionId)
        };
    }

    public async Task LogoutAsync(Guid sessionId)
    {
        var session = await _database.Sessions.FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session != null)
        {
            _database.Sessions.Remove(session);
        }
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);
        var sessionId = jwtToken.Claims.FirstOrDefault(c => c.Type == "sessionId")?.Value;

        if (string.IsNullOrEmpty(sessionId) || !Guid.TryParse(sessionId, out var sessionGuid))
        {
            return false;
        }

        return await _database.Sessions.AnyAsync(s => s.Id == sessionGuid);
    }

    private string GenerateJwtToken(User user, Guid sessionId)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("sessionId", sessionId.ToString())
        };

        var token = new JwtSecurityToken(
            _jwtSettings.Issuer,
            _jwtSettings.Audience,
            claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<bool> ValidateUserCredentialsAsync(string email, string password)
    {
        var user = await _database.Users.FirstOrDefaultAsync(
            u => u.EmailNormalized.Equals(
                email,
                StringComparison.InvariantCultureIgnoreCase
            )
        );

        return user != null && _hashService.Verify(password, user.PasswordHash);
    }
}