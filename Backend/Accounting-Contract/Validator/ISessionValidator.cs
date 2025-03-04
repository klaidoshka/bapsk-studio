using Accounting.Contract.Request;
using Accounting.Contract.Response;

namespace Accounting.Contract.Validator;

public interface ISessionValidator
{
    /// <summary>
    /// Validate the request to delete a session.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateSessionDeleteRequestAsync(SessionDeleteRequest request);

    /// <summary>
    /// Validate the request to get a session by id.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateSessionGetRequestAsync(SessionGetRequest request);
}