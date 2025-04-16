using Accounting.Contract.Dto.User;
using User = Accounting.Contract.Entity.User;

namespace Accounting.Contract.Service;

public interface IUserService
{
    public Task<User> CreateAsync(UserCreateRequest request);

    public Task DeleteAsync(int userId);

    public Task EditAsync(UserEditRequest request);

    public Task<IList<User>> GetAsync(UserGetRequest request);

    public Task<User> GetByIdAsync(int userId);
}