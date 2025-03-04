using Accounting.Contract.Request;
using Accounting.Contract.Response;

namespace Accounting.Contract.Validator;

public interface IDataTypeValidator
{
    /// <summary>
    /// Validates the data type create request.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateDataTypeCreateRequestAsync(DataTypeCreateRequest request);

    /// <summary>
    /// Validates the data type delete request.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateDataTypeDeleteRequestAsync(DataTypeDeleteRequest request);

    /// <summary>
    /// Validates the data type edit request.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateDataTypeEditRequestAsync(DataTypeEditRequest request);

    /// <summary>
    /// Validates the data type get request.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateDataTypeGetRequestAsync(DataTypeGetRequest request);

    /// <summary>
    /// Validates the data type get by instance request.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Task<Validation> ValidateDataTypeGetByInstanceRequestAsync(
        DataTypeGetByInstanceRequest request
    );

    /// <summary>
    /// Validates the data type field create request.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Validation ValidateDataTypeFieldCreateRequest(DataTypeFieldCreateRequest request);

    /// <summary>
    /// Validates the data type field edit request.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Validation result</returns>
    public Validation ValidateDataTypeFieldEditRequest(DataTypeFieldEditRequest request);
}