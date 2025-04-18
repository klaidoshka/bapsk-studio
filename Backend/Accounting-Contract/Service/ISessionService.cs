using Accounting.Contract.Dto.Session;
using Session = Accounting.Contract.Entity.Session;

namespace Accounting.Contract.Service;

public interface ISessionService
{
    public Task DeleteAsync(SessionDeleteRequest request);

    public Task<Session> GetAsync(SessionGetRequest request);

    public Task<IList<Session>> GetAsync(SessionGetByUserRequest request);
}