using Accounting.Contract.Dto.DataEntry;
using Accounting.Contract.Entity;
using DataEntry = Accounting.Contract.Entity.DataEntry;

namespace Accounting.Contract.Service;

public interface IDataEntryService
{
    public Task AddMissingDataTypeFieldsAsync(DataType dataType);

    public Task<DataEntry> CreateAsync(DataEntryCreateRequest request);

    public Task DeleteAsync(DataEntryDeleteRequest request);

    public Task EditAsync(DataEntryEditRequest request);

    public Task<DataEntry> GetAsync(DataEntryGetRequest request);

    public Task<IList<DataEntry>> GetAsync(DataEntryGetByDataTypeRequest request);

    public Task<IList<DataEntry>> GetAsync(DataEntryGetWithinIntervalRequest request);
    
    public Task<IList<DataEntry>> ImportAsync(DataEntryImportRequest request);
}