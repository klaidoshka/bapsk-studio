using Accounting.Contract;
using Accounting.Contract.Dto.User;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;
using User = Accounting.Contract.Entity.User;

namespace Accounting.Services.Service;

public class UserService : IUserService
{
    private readonly AccountingDatabase _database;
    private readonly IHashService _hashService;
    private readonly IUserValidator _userValidator;

    public UserService(
        AccountingDatabase database,
        IHashService hashService,
        IUserValidator userValidator
    )
    {
        _database = database;
        _hashService = hashService;
        _userValidator = userValidator;
    }

    public async Task<User> CreateAsync(UserCreateRequest request)
    {
        (await _userValidator.ValidateUserCreateRequestAsync(request)).AssertValid();

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

        user = (await _database.Users.AddAsync(user)).Entity;

        await _database.SaveChangesAsync();

        return user;
    }

    public async Task DeleteAsync(int userId)
    {
        (await _userValidator.ValidateUserDeleteAsync(userId)).AssertValid();

        var user = (await _database.Users.FindAsync(userId))!;

        user.IsDeleted = true;

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(UserEditRequest request)
    {
        (await _userValidator.ValidateUserEditAsync(request)).AssertValid();

        var user = (await _database.Users.FindAsync(request.UserId))!;

        user.BirthDate = request.BirthDate;
        user.Country = request.Country;
        user.Email = request.Email;
        user.EmailNormalized = request.Email.ToLowerInvariant();
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;

        await _database.SaveChangesAsync();
    }

    public async Task<IList<User>> GetAsync(UserGetRequest request)
    {
        var requester = (await _database.Users.FirstOrDefaultAsync(u => u.Id == request.RequesterId))!;

        if (request.ReturnIdentityOnly || requester.Role == Role.Admin)
        {
            return await _database.Users
                .Where(u => u.IsDeleted == false && (request.Email == null || u.Email == request.Email))
                .ToListAsync();
        }
        
        return await _database.InstanceUsers
            .Include(u => u.Instance)
            .ThenInclude(u => u.Users)
            .ThenInclude(u => u.User)
            .Where(u => u.UserId == requester.Id)
            .SelectMany(u => u.Instance.Users)
            .Select(u => u.User)
            .Where(u => u.IsDeleted == false && (request.Email == null || u.Email == request.Email))
            .ToListAsync();
    }

    public async Task<User> GetByIdAsync(int userId)
    {
        (await _userValidator.ValidateUserGetByIdAsync(userId)).AssertValid();

        return (await _database.Users.FindAsync(userId))!;
    }
}