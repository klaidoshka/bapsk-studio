using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Accounting.Contract;
using Accounting.Contract.Configuration;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Accounting.Services.Service;

public class JwtService : IJwtService
{
    private readonly AccountingDatabase _database;
    private readonly JwtSettings _jwtSettings;

    public JwtService(AccountingDatabase database, JwtSettings jwtSettings)
    {
        _database = database;
        _jwtSettings = jwtSettings;
    }

    public async Task<Session?> ExtractSessionAsync(string token)
    {
        var sessionId = ExtractSessionId(token);

        if (sessionId is null)
        {
            return null;
        }

        var session = await _database.Sessions
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        return session is null || session.User.IsDeleted
            ? null
            : session;
    }

    public Guid? ExtractSessionId(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);
        var idClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == Claims.SessionId)?.Value;

        return Guid.TryParse(idClaim, out var sessionId) ? sessionId : null;
    }

    public string GenerateAccessToken(User user, Guid sessionId)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var claims = ToClaims(user, sessionId);

        var token = new JwtSecurityToken(
            _jwtSettings.Issuer,
            _jwtSettings.Audience,
            claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private IEnumerable<Claim> ToClaims(User user, Guid sessionId)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(Claims.SessionId, sessionId.ToString())
        };

        var role = user.Role switch
        {
            Role.Admin => Roles.Admin,
            Role.User => Roles.User,
            _ => throw new ArgumentOutOfRangeException()
        };
        
        claims.Add(new Claim(ClaimTypes.Role, role));
        
        return claims;
    }

    public string GenerateRefreshToken(User user, Guid sessionId)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(Claims.SessionId, sessionId.ToString())
        };

        var token = new JwtSecurityToken(
            _jwtSettings.Issuer,
            _jwtSettings.Audience,
            claims,
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public bool IsTokenValid(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_jwtSettings.Secret);

        try
        {
            tokenHandler.ValidateToken(
                token,
                new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = _jwtSettings.Issuer,
                    ValidAudience = _jwtSettings.Audience
                },
                out _
            );

            return true;
        }
        catch
        {
            return false;
        }
    }
}