using Accounting.Contract.Entity;
using Accounting.Contract.Request.DataEntry;

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
    /// <param name="request">Request to process</param>
    public Task DeleteAsync(DataEntryDeleteRequest request);

    /// <summary>
    /// Edits a data entry.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task EditAsync(DataEntryEditRequest request);

    /// <summary>
    /// Gets a data entry by id.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Data entry of specified id</returns>
    public Task<DataEntry> GetAsync(DataEntryGetRequest request);

    /// <summary>
    /// Gets all data entries of a data type.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Data entries of the data type</returns>
    public Task<IEnumerable<DataEntry>> GetByDataTypeIdAsync(DataEntryGetByDataTypeRequest request);
}