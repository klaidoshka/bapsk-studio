using Accounting.Contract.Dto.DataEntry;
using DataEntry = Accounting.Contract.Entity.DataEntry;

namespace Accounting.Contract.Service;

public interface IDataEntryService
{
    public Task AddMissingDataTypeFieldsWithoutSaveAsync(int dataTypeId);
    
    public Task<DataEntry> CreateAsync(DataEntryCreateRequest request);

    public Task DeleteAsync(DataEntryDeleteRequest request);

    public Task EditAsync(DataEntryEditRequest request);

    public Task<DataEntry> GetAsync(DataEntryGetRequest request);

    public Task<IList<DataEntry>> GetByDataTypeIdAsync(DataEntryGetByDataTypeRequest request);
}