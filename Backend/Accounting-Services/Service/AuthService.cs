using Accounting.Contract;
using Accounting.Contract.Configuration;
using Accounting.Contract.Dto;
using Accounting.Contract.Request;
using Accounting.Contract.Response;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;
using Session = Accounting.Contract.Entity.Session;
using User = Accounting.Contract.Entity.User;

namespace Accounting.Services.Service;

public class AuthService : IAuthService
{
    private readonly IAuthValidator _authValidator;
    private readonly AccountingDatabase _database;
    private readonly IHashService _hashService;
    private readonly IJwtService _jwtService;
    private readonly JwtSettings _jwtSettings;

    public AuthService(
        IAuthValidator authValidator,
        AccountingDatabase database,
        IHashService hashService,
        IJwtService jwtService,
        JwtSettings jwtSettings
    )
    {
        _authValidator = authValidator;
        _database = database;
        _hashService = hashService;
        _jwtService = jwtService;
        _jwtSettings = jwtSettings;
    }

    public async Task<JwtTokenPair> LoginAsync(LoginRequest request)
    {
        _authValidator
            .ValidateLoginRequest(request)
            .AssertValid();

        (await _authValidator.ValidateUserCredentialsAsync(request.Email, request.Password))
            .AssertValid();

        var user = await _database.Users.FirstAsync(
            u => u.EmailNormalized.Equals(
                request.Email,
                StringComparison.InvariantCultureIgnoreCase
            )
        );

        var sessionId = Guid.NewGuid();

        var token = new JwtTokenPair
        {
            AccessToken = _jwtService.GenerateAccessToken(user, sessionId),
            RefreshToken = _jwtService.GenerateRefreshToken(user, sessionId),
            RefreshTokenExpiresAt =
                DateTime.UtcNow.AddMinutes(_jwtSettings.RefreshTokenExpiryMinutes),
            User = user
        };

        await _database.Sessions.AddAsync(
            new Session
            {
                Agent = request.Meta!.Agent!,
                CreatedAt = DateTime.UtcNow,
                Id = sessionId,
                IpAddress = request.Meta!.IpAddress!,
                Location = request.Meta!.Location ?? "Unknown location",
                RefreshToken = token.RefreshToken,
                UserId = user.Id
            }
        );

        await _database.SaveChangesAsync();

        return token;
    }

    public async Task LogoutAsync(Guid sessionId)
    {
        var session = await _database.Sessions.FindAsync(sessionId);

        if (session == null)
        {
            throw new ValidationException("Session not found.");
        }

        _database.Sessions.Remove(session);

        await _database.SaveChangesAsync();
    }

    public async Task<JwtTokenPair> RefreshTokenAsync(string refreshToken)
    {
        var validation = await _authValidator.ValidateRefreshTokenAsync(refreshToken);

        if (!validation.IsValid)
        {
            throw new ValidationException("Invalid refresh token.");
        }

        var sessionId = _jwtService.ExtractSessionId(refreshToken);

        var session = await _database.Sessions
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session == null)
        {
            throw new ValidationException("Session not found.");
        }

        var token = new JwtTokenPair
        {
            AccessToken = _jwtService.GenerateAccessToken(session.User, session.Id),
            RefreshToken = _jwtService.GenerateRefreshToken(session.User, session.Id),
            RefreshTokenExpiresAt =
                DateTime.UtcNow.AddMinutes(_jwtSettings.RefreshTokenExpiryMinutes),
            User = session.User
        };

        session.RefreshToken = token.RefreshToken;

        await _database.SaveChangesAsync();

        return token;
    }

    public async Task<JwtTokenPair> RegisterAsync(RegisterRequest request)
    {
        (await _authValidator.ValidateRegisterRequestAsync(request)).AssertValid();

        var user = new User
        {
            BirthDate = request.BirthDate,
            Country = request.Country,
            Email = request.Email,
            EmailNormalized = request.Email.ToLowerInvariant(),
            FirstName = request.FirstName,
            IsDeleted = false,
            LastName = request.LastName,
            PasswordHash = _hashService.Hash(request.Password)
        };

        await _database.Users.AddAsync(user);

        await _database.SaveChangesAsync();

        return await LoginAsync(
            new LoginRequest
            {
                Email = request.Email,
                Meta = request.Meta,
                Password = request.Password
            }
        );
    }
}