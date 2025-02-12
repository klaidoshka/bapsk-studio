using Accounting.Contract.Entity;
using Accounting.Contract.Request;

namespace Accounting.Contract.Service;

public interface IDataEntryFieldService
{
    /// <summary>
    /// Creates a field entry into a data entry.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Created entry field</returns>
    public Task<DataEntryField> CreateAsync(DataEntryFieldCreateRequest request);

    /// <summary>
    /// Deletes a field from a data entry. Field must be optional.
    /// </summary>
    /// <param name="id">Data entry field id</param>
    public Task DeleteAsync(int id);

    /// <summary>
    /// Edits a field of a data entry.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task EditAsync(DataEntryFieldEditRequest request);

    /// <summary>
    /// Gets a field entry by id.
    /// </summary>
    /// <param name="id">Data entry field id</param>
    /// <returns>Data entry field by specified id</returns>
    public Task<DataEntryField> GetAsync(int id);

    /// <summary>
    /// Gets all fields of a data entry.
    /// </summary>
    /// <param name="dataEntryId">Data entry id to get fields for</param>
    /// <returns>Data entry fields</returns>
    public Task<IEnumerable<DataEntryField>> GetByDataEntryIdAsync(int dataEntryId);
}