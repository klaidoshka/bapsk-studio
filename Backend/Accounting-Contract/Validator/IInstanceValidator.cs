using Accounting.Contract.Request;
using Accounting.Contract.Response;

namespace Accounting.Contract.Validator;

public interface IInstanceValidator
{
    /// <summary>
    /// Validates the request to create an instance
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateInstanceCreateRequestAsync(InstanceCreateRequest request);

    /// <summary>
    /// Validates the request to delete an instance
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateInstanceDeleteRequestAsync(InstanceDeleteRequest request);

    /// <summary>
    /// Validates the request to edit an instance
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateInstanceEditRequestAsync(InstanceEditRequest request);

    /// <summary>
    /// Validates the request to get an instance
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateInstanceGetRequestAsync(InstanceGetRequest request);
}