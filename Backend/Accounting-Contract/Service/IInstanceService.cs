using Accounting.Contract.Dto.Instance;
using Instance = Accounting.Contract.Entity.Instance;

namespace Accounting.Contract.Service;

public interface IInstanceService
{
    public Task<Instance> CreateAsync(InstanceCreateRequest request);

    public Task DeleteAsync(InstanceDeleteRequest request);

    public Task EditAsync(InstanceEditRequest request);

    public Task<Instance> GetAsync(InstanceGetRequest request);

    public Task<IEnumerable<Instance>> GetByUserIdAsync(InstanceGetByUserRequest request);
}