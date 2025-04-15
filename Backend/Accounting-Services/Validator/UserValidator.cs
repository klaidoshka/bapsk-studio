using Accounting.Contract;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.User;
using Accounting.Contract.Entity;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Validator;

public class UserValidator : IUserValidator
{
    private readonly AccountingDatabase _database;

    public UserValidator(AccountingDatabase database)
    {
        _database = database;
    }

    private async Task<Validation> ValidateUserExists(int userId)
    {
        var user = await _database.Users.FindAsync(userId);

        return user == null || user.IsDeleted
            ? new Validation("User was not found.")
            : new Validation();
    }

    public async Task<Validation> ValidateUserDeleteAsync(int userId) =>
        await ValidateUserExists(userId);

    public async Task<Validation> ValidateUserDeleteAuthorizationAsync(int requesterId)
    {
        var requester = await _database.Users.FindAsync(requesterId);

        return new Validation(requester?.Role == Role.Admin);
    }

    public async Task<Validation> ValidateUserEditAsync(UserEditRequest request)
    {
        var validation = await ValidateUserExists(request.UserId);

        if (!validation.IsValid)
        {
            return validation;
        }

        var failures = new List<string>();

        if (String.IsNullOrWhiteSpace(request.FirstName))
        {
            failures.Add("First name is required.");
        }

        if (String.IsNullOrWhiteSpace(request.LastName))
        {
            failures.Add("Last name is required.");
        }

        if (String.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains('@'))
        {
            failures.Add("Email is required, it must be valid.");
        }

        return new Validation(failures);
    }

    public async Task<Validation> ValidateUserEditAuthorizationAsync(int requesterId, int userId)
    {
        if (requesterId == userId)
        {
            return new Validation();
        }

        var requester = await _database.Users.FindAsync(requesterId);

        return new Validation(requester?.Role == Role.Admin);
    }

    public async Task<Validation> ValidateUserGetByIdAsync(int userId) =>
        await ValidateUserExists(userId);

    public async Task<Validation> ValidateUserGetByIdAuthorizationAsync(
        int requesterId,
        int userId,
        bool onlyIdentity = false
    )
    {
        if (requesterId == userId || onlyIdentity)
        {
            return new Validation();
        }

        var requester = await _database.Users.FindAsync(requesterId);

        if (requester?.Role == Role.Admin)
        {
            return new Validation();
        }

        var userIds = await _database.InstanceUserMetas
            .Include(u => u.Instance)
            .ThenInclude(u => u.UserMetas)
            .ThenInclude(u => u.User)
            .Where(u => u.UserId == requesterId)
            .SelectMany(u => u.Instance.UserMetas)
            .Select(u => u.User)
            .Where(u => u.IsDeleted == false)
            .Select(u => u.Id)
            .ToHashSetAsync();

        return new Validation(userIds.Contains(userId));
    }
}