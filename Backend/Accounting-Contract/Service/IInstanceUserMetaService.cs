using Accounting.Contract.Entity;
using Accounting.Contract.Request.Instance;

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
    /// <param name="request">Request to process</param>
    public Task DeleteAsync(InstanceUserMetaDeleteRequest request);

    /// <summary>
    /// Gets instance's user meta.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Instance's user meta</returns>
    public Task<InstanceUserMeta> GetAsync(InstanceUserMetaGetRequest request);

    /// <summary>
    /// Gets all users for an instance.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Instance's user metas</returns>
    public Task<IEnumerable<InstanceUserMeta>> GetByInstanceIdAsync(
        InstanceUserMetaGetByInstanceRequest request
    );
}