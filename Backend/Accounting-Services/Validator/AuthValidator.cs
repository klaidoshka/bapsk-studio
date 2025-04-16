using Accounting.Contract;
using Accounting.Contract.Configuration;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Auth;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Validator;

public class AuthValidator : IAuthValidator
{
    private readonly AccountingDatabase _database;
    private readonly Email _email;
    private readonly IEncryptService _encryptService;
    private readonly IHashService _hashService;
    private readonly IJwtService _jwtService;

    public AuthValidator(
        AccountingDatabase database,
        Email email,
        IEncryptService encryptService,
        IHashService hashService,
        IJwtService jwtService
    )
    {
        _database = database;
        _email = email;
        _encryptService = encryptService;
        _jwtService = jwtService;
        _hashService = hashService;
    }

    public Validation ValidateAuthMeta(AuthUserMeta meta)
    {
        var failures = new List<string>();

        if (String.IsNullOrWhiteSpace(meta.Agent))
        {
            failures.Add("Agent is required in authentication meta.");
        }

        if (String.IsNullOrWhiteSpace(meta.IpAddress))
        {
            failures.Add("IP address is required in authentication meta.");
        }

        return new(failures);
    }

    public async Task<Validation<(User?, User?)>> ValidateChangePasswordRequestAsync(ChangePasswordRequest request)
    {
        if (request.RequesterId is null && request.ResetPasswordToken is null)
        {
            throw new ArgumentException("Either requesterId or resetPasswordToken must be provided.");
        }

        if (
            String.IsNullOrWhiteSpace(request.Password) ||
            request.Password.Length < 7 ||
            request.Password.All(ch => request.Password[0] == ch)
        )
        {
            return new("Password must have at least 7 characters and be not a sequence of the same character.");
        }

        if (request.ResetPasswordToken is not null)
        {
            var token = _encryptService.DecryptAsync(request.ResetPasswordToken!, _email.ResetPassword.Secret);
            var tokenParts = token.Result.Split('|');
            
            if (tokenParts.Length != 3)
            {
                return new("Invalid reset password token.");
            }
            
            if (!Int32.TryParse(tokenParts[0], out var userId))
            {
                return new("Invalid reset password token.");
            }
            
            if (!DateTime.TryParse(tokenParts[2], out var expirationDate))
            {
                return new("Invalid reset password token.");
            }
            
            if (expirationDate < DateTime.UtcNow)
            {
                return new("Reset password token expired.");
            }
            
            var user = await _database.Users.FirstOrDefaultAsync(
                u => u.Id == userId && u.EmailNormalized.Equals(tokenParts[1], StringComparison.InvariantCultureIgnoreCase)
            );
            
            if (user is null || user.IsDeleted)
            {
                return new("Requested account does not exist.");
            }

            return new((null, user));
        }
        
        var userRequester = await _database.Users.FirstOrDefaultAsync(
            u => u.Id == request.RequesterId && u.IsDeleted == false
        );
        
        if (userRequester is null)
        {
            return new("Requested account does not exist.");
        }

        return new((userRequester, null));
    }

    public Validation ValidateLoginRequest(LoginRequest request)
    {
        var failures = new List<string>();

        if (request.Meta is null)
        {
            failures.Add("Meta is required in login request.");
        }
        else
        {
            failures.AddRange(ValidateAuthMeta(request.Meta).FailureMessages);
        }

        if (String.IsNullOrWhiteSpace(request.Password))
        {
            failures.Add("Password is required.");
        }

        if (String.IsNullOrWhiteSpace(request.Email))
        {
            failures.Add("Email is required.");
        }

        return new(failures);
    }

    public async Task<Validation> ValidateRegisterRequestAsync(RegisterRequest request)
    {
        var failures = new List<string>();

        if (request.Meta is null)
        {
            failures.Add("Meta is required in login request.");
        }
        else
        {
            failures.AddRange(ValidateAuthMeta(request.Meta).FailureMessages);
        }

        if (String.IsNullOrWhiteSpace(request.Password))
        {
            failures.Add("Password is required.");
        }

        if (String.IsNullOrWhiteSpace(request.Email))
        {
            failures.Add("Email is required.");
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
            failures.Add("Specified email cannot be used to register an user.");
        }

        if (
            String.IsNullOrWhiteSpace(request.Password) ||
            request.Password.Length < 7 ||
            request.Password.All(ch => request.Password[0] == ch)
        )
        {
            failures.Add(
                "Password must have at least 7 characters and be not a sequence of the same character."
            );
        }

        if (String.IsNullOrWhiteSpace(request.FirstName))
        {
            failures.Add("First name is required.");
        }

        return new(failures);
    }

    public async Task<Validation> ValidateRefreshTokenAsync(string refreshToken)
    {
        var sessionId = _jwtService.ExtractSessionId(refreshToken);

        var session = await _database.Sessions
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session is null || session.User.IsDeleted || session.RefreshToken != refreshToken)
        {
            return new("Session was not found.");
        }

        return new();
    }

    public async Task<Validation> ValidateUserCredentialsAsync(string email, string password)
    {
        var user = await _database.Users.FirstOrDefaultAsync(
            u => u.EmailNormalized.Equals(
                email,
                StringComparison.InvariantCultureIgnoreCase
            )
        );

        if (user is null || user.IsDeleted)
        {
            return new("Invalid credentials or user does not exist.");
        }

        return _hashService.Verify(password, user.PasswordHash)
            ? new()
            : new("Invalid credentials or user does not exist.");
    }

    public async Task<Validation<User>> ValidateResetPasswordAsync(ResetPasswordRequest request)
    {
        var user = await _database.Users.FirstOrDefaultAsync(
            u => u.EmailNormalized.Equals(
                request.Email,
                StringComparison.InvariantCultureIgnoreCase
            )
        );

        if (user is null || user.IsDeleted)
        {
            return new("Requested account does not exist.");
        }

        return new(user);
    }
}