using Accounting.Contract.Entity;
using Accounting.Contract.Request.DataType;

namespace Accounting.Contract.Service;

public interface IDataTypeService
{
    /// <summary>
    /// Creates a new data type.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Created data type</returns>
    public Task<DataType> CreateAsync(DataTypeCreateRequest request);

    /// <summary>
    /// Deletes a data type.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task DeleteAsync(DataTypeDeleteRequest request);

    /// <summary>
    /// Edits a data type.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task EditAsync(DataTypeEditRequest request);

    /// <summary>
    /// Gets a data type by id.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task<DataType> GetAsync(DataTypeGetRequest request);

    /// <summary>
    /// Gets all data types of an instance.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Data types of the instance</returns>
    public Task<IEnumerable<DataType>> GetByInstanceIdAsync(DataTypeGetByInstanceRequest request);
}