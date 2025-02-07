using Accounting.Contract;
using Accounting.Contract.Auth;
using Accounting.Contract.Entity;
using Accounting.Contract.Result;
using Accounting.Contract.Service;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class AuthService : IAuthService
{
    private readonly AccountingDatabase _database;
    private readonly IHashService _hashService;
    private readonly IJwtService _jwtService;

    public AuthService(
        AccountingDatabase database,
        IHashService hashService,
        IJwtService jwtService
    )
    {
        _database = database;
        _hashService = hashService;
        _jwtService = jwtService;
    }

    public async Task<JwtTokenPair> LoginAsync(LoginRequest request)
    {
        var user = await _database.Users.FirstOrDefaultAsync(
            u => u.EmailNormalized.Equals(
                request.Email,
                StringComparison.InvariantCultureIgnoreCase
            )
        );

        if (user == null || !(await ValidateUserCredentialsAsync(request.Email, request.Password)).IsValid)
        {
            throw new UnauthorizedAccessException("Invalid credentials or user does not exist");
        }

        var sessionId = Guid.NewGuid();

        var token = new JwtTokenPair
        {
            AccessToken = _jwtService.GenerateAccessToken(user, sessionId),
            RefreshToken = _jwtService.GenerateRefreshToken(user, sessionId)
        };

        await _database.Sessions.AddAsync(
            new Session
            {
                Agent = request.Agent,
                CreatedAt = DateTime.UtcNow,
                Id = sessionId,
                IpAddress = request.IpAddress,
                Location = request.Location,
                RefreshToken = token.RefreshToken,
                UserId = user.Id
            }
        );

        await _database.SaveChangesAsync();

        return token;
    }

    public async Task LogoutAsync(Guid sessionId)
    {
        var session = await _database.Sessions.FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session != null)
        {
            _database.Sessions.Remove(session);

            await _database.SaveChangesAsync();
        }
    }

    public async Task<JwtTokenPair> RefreshTokenAsync(string refreshToken)
    {
        var validation = await ValidateRefreshTokenAsync(refreshToken);

        if (!validation.IsValid)
        {
            throw new UnauthorizedAccessException("Invalid refresh token");
        }

        var sessionId = _jwtService.ExtractSessionId(refreshToken);

        var session = await _database
            .Sessions
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session == null)
        {
            throw new UnauthorizedAccessException("Session not found");
        }

        var token = new JwtTokenPair
        {
            AccessToken = _jwtService.GenerateAccessToken(session.User, session.Id),
            RefreshToken = _jwtService.GenerateRefreshToken(session.User, session.Id)
        };

        session.RefreshToken = token.RefreshToken;

        await _database.SaveChangesAsync();

        return token;
    }

    public async Task<JwtTokenPair> RegisterAsync(RegisterRequest request)
    {
        var user = new User
        {
            BirthDate = request.BirthDate,
            Country = request.Country,
            Email = request.Email,
            EmailNormalized = request.Email.ToLowerInvariant(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            PasswordHash = _hashService.Hash(request.Password)
        };

        await _database.Users.AddAsync(user);

        await _database.SaveChangesAsync();

        return await LoginAsync(
            new LoginRequest
            {
                Agent = request.Agent,
                Email = request.Email,
                IpAddress = request.IpAddress,
                Location = request.Location,
                Password = request.Password
            }
        );
    }

    public Validation ValidateLoginRequest(LoginRequest request)
    {
        var failures = new List<string>();

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            failures.Add("Password is required");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            failures.Add("Email is required");
        }

        return new Validation(failures);
    }

    public async Task<Validation> ValidateRegisterRequestAsync(RegisterRequest request)
    {
        var failures = new List<string>();

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            failures.Add("Password is required");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            failures.Add("Email is required");
        }

        if (
            await _database.Users.AnyAsync(
                u => u.EmailNormalized.Equals(
                    request.Email,
                    StringComparison.InvariantCultureIgnoreCase
                )
            )
        )
        {
            failures.Add("Specified email cannot be used to register an user");
        }

        if (
            string.IsNullOrWhiteSpace(request.Password) ||
            request.Password.Length < 7 ||
            request.Password.All(ch => request.Password[0] == ch)
        )
        {
            failures.Add("Password must have at least 7 characters and be not a sequence of the same character");
        }

        if (string.IsNullOrWhiteSpace(request.FirstName))
        {
            failures.Add("First name is required");
        }

        return new Validation(failures);
    }

    public async Task<Validation> ValidateRefreshTokenAsync(string refreshToken)
    {
        var sessionId = _jwtService.ExtractSessionId(refreshToken);
        var session = await _database.Sessions.FirstOrDefaultAsync(s => s.Id == sessionId);

        return session?.RefreshToken == refreshToken
            ? new Validation()
            : new Validation("Session was not found");
    }

    public async Task<Validation> ValidateUserCredentialsAsync(string email, string password)
    {
        var user = await _database.Users.FirstOrDefaultAsync(
            u => u.EmailNormalized.Equals(
                email,
                StringComparison.InvariantCultureIgnoreCase
            )
        );

        return user != null && _hashService.Verify(password, user.PasswordHash)
            ? new Validation()
            : new Validation("Invalid credentials or user does not exist");
    }
}