using Accounting.Contract;
using Accounting.Contract.Auth;
using Accounting.Contract.Response;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Validator;

public class AuthValidator : IAuthValidator
{
    private readonly AccountingDatabase _database;
    private readonly IHashService _hashService;
    private readonly IJwtService _jwtService;

    public AuthValidator(AccountingDatabase database, IHashService hashService, IJwtService jwtService)
    {
        _database = database;
        _jwtService = jwtService;
        _hashService = hashService;
    }

    public Validation ValidateLoginRequest(LoginRequest request)
    {
        var failures = new List<string>();

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            failures.Add("Password is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            failures.Add("Email is required.");
        }

        return new Validation(failures);
    }

    public async Task<Validation> ValidateRegisterRequestAsync(RegisterRequest request)
    {
        var failures = new List<string>();

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            failures.Add("Password is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
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
            string.IsNullOrWhiteSpace(request.Password) ||
            request.Password.Length < 7 ||
            request.Password.All(ch => request.Password[0] == ch)
        )
        {
            failures.Add("Password must have at least 7 characters and be not a sequence of the same character.");
        }

        if (string.IsNullOrWhiteSpace(request.FirstName))
        {
            failures.Add("First name is required.");
        }

        return new Validation(failures);
    }

    public async Task<Validation> ValidateRefreshTokenAsync(string refreshToken)
    {
        var sessionId = _jwtService.ExtractSessionId(refreshToken);

        var session = await _database.Sessions
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session == null || session.User.IsDeleted || session.RefreshToken != refreshToken)
        {
            return new Validation("Session was not found.");
        }

        return new Validation();
    }

    public async Task<Validation> ValidateUserCredentialsAsync(string email, string password)
    {
        var user = await _database.Users.FirstOrDefaultAsync(
            u => u.EmailNormalized.Equals(
                email,
                StringComparison.InvariantCultureIgnoreCase
            )
        );

        if (user == null || user.IsDeleted)
        {
            return new Validation("Invalid credentials or user does not exist.");
        }

        return _hashService.Verify(password, user.PasswordHash)
            ? new Validation()
            : new Validation("Invalid credentials or user does not exist.");
    }
}