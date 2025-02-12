using Accounting.Contract.Entity;
using Accounting.Contract.Request;

namespace Accounting.Contract.Service;

public interface IDataTypeFieldService
{
    /// <summary>
    /// Creates a field into a data type.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Created data type field</returns>
    public Task<DataTypeField> CreateAsync(DataTypeFieldCreateRequest request);

    /// <summary>
    /// Deletes a field from a data type.
    /// </summary>
    /// <param name="id">Data type field id</param>
    /// <param name="managerId">Manager's, who's deleting the field, id</param>
    public Task DeleteAsync(int id, int managerId);

    /// <summary>
    /// Edits a field of a data type.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task EditAsync(DataTypeFieldEditRequest request);

    /// <summary>
    /// Gets a field by id.
    /// </summary>
    /// <param name="id">Data type field id</param>
    /// <returns>Data type field by specified id</returns>
    public Task<DataTypeField> GetAsync(int id);

    /// <summary>
    /// Gets all fields of a data type.
    /// </summary>
    /// <param name="dataTypeId">Data field id to get fields for</param>
    /// <returns>Data type fields</returns>
    public Task<IEnumerable<DataTypeField>> GetByDataTypeIdAsync(int dataTypeId);
}