using Accounting.Contract.Request;
using Accounting.Contract.Response;

namespace Accounting.Contract.Validator;

public interface IDataEntryValidator
{
    /// <summary>
    /// Validates the data type create request.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateDataEntryCreateRequestAsync(DataEntryCreateRequest request);

    /// <summary>
    /// Validates the data type delete request.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateDataEntryDeleteRequestAsync(DataEntryDeleteRequest request);

    /// <summary>
    /// Validates the data type edit request.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateDataEntryEditRequestAsync(DataEntryEditRequest request);

    /// <summary>
    /// Validates the data type get request.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateDataEntryGetRequestAsync(DataEntryGetRequest request);

    /// <summary>
    /// Validates the data type get by instance request.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateDataEntryGetByDataTypeRequestAsync(DataEntryGetByDataTypeRequest request);

    /// <summary>
    /// Validates the data type field create request.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateDataEntryFieldCreateRequestAsync(DataEntryFieldCreateRequest request);

    /// <summary>
    /// Validates the data type field edit request.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateDataEntryFieldEditRequestAsync(DataEntryFieldEditRequest request);
}