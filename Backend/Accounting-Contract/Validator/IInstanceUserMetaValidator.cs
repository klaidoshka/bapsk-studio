using Accounting.Contract.Request;
using Accounting.Contract.Response;

namespace Accounting.Contract.Validator;

public interface IInstanceUserMetaValidator
{
    /// <summary>
    /// Validates the request to create an instance user meta.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateInstanceUserMetaCreateRequestAsync(InstanceUserMetaCreateRequest request);

    /// <summary>
    /// Validates the request to delete an instance user meta.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateInstanceUserMetaDeleteRequestAsync(InstanceUserMetaDeleteRequest request);

    /// <summary>
    /// Validates the request to get an instance user meta.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateInstanceUserMetaGetRequestAsync(InstanceUserMetaGetRequest request);

    /// <summary>
    /// Validates the request to get instance user metas by instance.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateInstanceUserMetaGetByInstanceRequestAsync(InstanceUserMetaGetByInstanceRequest request);
}