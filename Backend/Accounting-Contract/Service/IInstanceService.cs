using Accounting.Contract.Entity;
using Accounting.Contract.Service.Request;

namespace Accounting.Contract.Service;

public interface IInstanceService
{
    /// <summary>
    /// Creates a new instance.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Created instance</returns>
    public Task<Instance> CreateAsync(InstanceCreateRequest request);

    /// <summary>
    /// Deletes an instance.
    /// </summary>
    /// <param name="instanceId">Instance id to delete</param>
    public Task DeleteAsync(int instanceId);

    /// <summary>
    /// Edits an instance.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task EditAsync(InstanceEditRequest request);

    /// <summary>
    /// Gets all instances.
    /// </summary>
    /// <returns></returns>
    public Task<IEnumerable<Instance>> GetAsync();

    /// <summary>
    /// Gets an instance by id.
    /// </summary>
    /// <param name="instanceId">Instance id to get instance of</param>
    /// <returns>Instance of provided id</returns>
    public Task<Instance> GetAsync(int instanceId);

    /// <summary>
    /// Gets all instances the provided user is in.
    /// </summary>
    /// <param name="userId">User id to get instances from</param>
    /// <returns>Instances user is able to work in</returns>
    public Task<IEnumerable<Instance>> GetByUserIdAsync(int userId);
}