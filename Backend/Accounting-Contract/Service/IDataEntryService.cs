using Accounting.Contract.Entity;
using Accounting.Contract.Request;

namespace Accounting.Contract.Service;

public interface IDataEntryService
{
    /// <summary>
    /// Creates a new data entry.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Created data entry</returns>
    public Task<DataEntry> CreateAsync(DataEntryCreateRequest request);

    /// <summary>
    /// Deletes a data entry.
    /// </summary>
    /// <param name="id">Data entry id to delete</param>
    /// <param name="managerId">Manager, who's deleting data entry, id</param>
    public Task DeleteAsync(int id, int managerId);

    /// <summary>
    /// Edits a data entry.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task EditAsync(DataEntryEditRequest request);

    /// <summary>
    /// Gets a data entry by id.
    /// </summary>
    /// <param name="id">Data entry id</param>
    /// <returns>Data entry of specified id</returns>
    public Task<DataEntry> GetAsync(int id);

    /// <summary>
    /// Gets all data entries of a data type.
    /// </summary>
    /// <param name="dataTypeId">Data type id</param>
    /// <returns>Data entries of the data type</returns>
    public Task<IEnumerable<DataEntry>> GetByDataTypeIdAsync(int dataTypeId);
}