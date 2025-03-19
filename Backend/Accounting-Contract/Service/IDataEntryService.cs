using Accounting.Contract.Dto.DataEntry;
using DataEntry = Accounting.Contract.Entity.DataEntry;

namespace Accounting.Contract.Service;

public interface IDataEntryService
{
    public Task<DataEntry> CreateAsync(DataEntryCreateRequest request);

    public Task DeleteAsync(DataEntryDeleteRequest request);

    public Task EditAsync(DataEntryEditRequest request);

    public Task<DataEntry> GetAsync(DataEntryGetRequest request);

    public Task<IEnumerable<DataEntry>> GetByDataTypeIdAsync(DataEntryGetByDataTypeRequest request);
}