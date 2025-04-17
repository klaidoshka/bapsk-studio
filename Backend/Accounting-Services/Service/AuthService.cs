using Accounting.Contract;
using Accounting.Contract.Configuration;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Auth;
using Accounting.Contract.Email;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;
using ResetPasswordRequest = Accounting.Contract.Dto.Auth.ResetPasswordRequest;
using Session = Accounting.Contract.Entity.Session;
using User = Accounting.Contract.Entity.User;

namespace Accounting.Services.Service;

public class AuthService : IAuthService
{
    private readonly IAuthValidator _authValidator;
    private readonly AccountingDatabase _database;
    private readonly Email _email;
    private readonly IEmailService _emailService;
    private readonly IEncryptService _encryptService;
    private readonly IHashService _hashService;
    private readonly IJwtService _jwtService;

    public AuthService(
        IAuthValidator authValidator,
        AccountingDatabase database,
        Email email,
        IEmailService emailService,
        IEncryptService encryptService,
        IHashService hashService,
        IJwtService jwtService
    )
    {
        _authValidator = authValidator;
        _database = database;
        _email = email;
        _emailService = emailService;
        _encryptService = encryptService;
        _hashService = hashService;
        _jwtService = jwtService;
    }

    public async Task ChangePasswordAsync(ChangePasswordRequest request)
    {
        var (userRequester, userByToken) = (await _authValidator.ValidateChangePasswordRequestAsync(request))
            .AssertValid()
            .Value;

        if (userRequester is not null)
        {
            userRequester.PasswordHash = _hashService.Hash(request.Password);

            await _database.SaveChangesAsync();

            return;
        }

        userByToken!.PasswordHash = _hashService.Hash(request.Password);

        await _database.SaveChangesAsync();
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
                StringComparison.OrdinalIgnoreCase
            )
        );

        var sessionId = Guid.NewGuid();

        var token = new JwtTokenPair
        {
            AccessToken = _jwtService.GenerateAccessToken(user, sessionId),
            RefreshToken = _jwtService.GenerateRefreshToken(user, sessionId),
            SessionId = sessionId,
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
            throw new ValidationException("Session was not found.");
        }

        _database.Sessions.Remove(session);

        await _database.SaveChangesAsync();
    }

    public async Task<JwtTokenPair> RefreshTokenAsync(string refreshToken)
    {
        (await _authValidator.ValidateRefreshTokenAsync(refreshToken)).AssertValid();

        var sessionId = _jwtService.ExtractSessionId(refreshToken);

        var session = await _database.Sessions
            .Include(s => s.User)
            .FirstAsync(s => s.Id == sessionId);

        var token = new JwtTokenPair
        {
            AccessToken = _jwtService.GenerateAccessToken(session.User, session.Id),
            RefreshToken = refreshToken,
            SessionId = session.Id,
            User = session.User
        };

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

    public async Task ResetPasswordAsync(ResetPasswordRequest request)
    {
        var user = (await _authValidator.ValidateResetPasswordAsync(request))
            .AssertValid()
            .Value;

        var token = $"{user.Id}|{user.EmailNormalized}|{DateTime.UtcNow.AddMinutes(10)}";
        var tokenEncrypted = await _encryptService.EncryptAsync(token, _email.ResetPassword.Secret);

        await _emailService.SendAsync(
            user.Email,
            Emails.ResetPasswordRequest(tokenEncrypted, _email.ResetPassword.Endpoint)
        );
    }
}