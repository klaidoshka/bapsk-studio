using Accounting.Contract.Entity;
using Accounting.Contract.Request.Instance;

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
    /// <param name="request">Request to process</param>
    public Task DeleteAsync(InstanceDeleteRequest request);

    /// <summary>
    /// Edits an instance.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task EditAsync(InstanceEditRequest request);

    /// <summary>
    /// Gets an instance by id.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Instance of provided id</returns>
    public Task<Instance> GetAsync(InstanceGetRequest request);

    /// <summary>
    /// Gets all instances the provided user is in.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Instances user is able to work in</returns>
    public Task<IEnumerable<Instance>> GetByUserIdAsync(InstanceGetByUserRequest request);
}