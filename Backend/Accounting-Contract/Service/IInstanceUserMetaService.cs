using Accounting.Contract.Entity;
using Accounting.Contract.Service.Request;

namespace Accounting.Contract.Service;

public interface IInstanceUserMetaService
{
    /// <summary>
    /// Adds a user to an instance.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Created instance user meta</returns>
    public Task<InstanceUserMeta> CreateAsync(InstanceUserMetaCreateRequest request);

    /// <summary>
    /// Removes a user from an instance.
    /// </summary>
    /// <param name="id">Id of the instance user meta to delete</param>
    /// <param name="managerId">Manager, who's deleting meta, id</param>
    public Task DeleteAsync(int id, int managerId);

    /// <summary>
    /// Gets instance's user meta.
    /// </summary>
    /// <param name="id">User meta's id</param>
    /// <returns>Instance's user meta</returns>
    public Task<InstanceUserMeta> GetAsync(int id);

    /// <summary>
    /// Gets all users for an instance.
    /// </summary>
    /// <param name="instanceId">Instance id to get metas for</param>
    /// <returns>Instance's user metas</returns>
    public Task<IEnumerable<InstanceUserMeta>> GetByInstanceIdAsync(int instanceId);
}