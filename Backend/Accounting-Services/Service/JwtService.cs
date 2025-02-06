using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Accounting.Contract.Configuration;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Microsoft.IdentityModel.Tokens;

namespace Accounting.Services.Service;

public class JwtService : IJwtService
{
    private readonly JwtSettings _jwtSettings;

    public JwtService(JwtSettings jwtSettings)
    {
        _jwtSettings = jwtSettings;
    }

    public Guid? ExtractSessionId(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);
        var idClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "sessionId")?.Value;

        return Guid.TryParse(idClaim, out var sessionId) ? sessionId : null;
    }

    public string GenerateAccessToken(User user, Guid sessionId)
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
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken(User user, Guid sessionId)
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
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.RefreshTokenExpiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}