using Accounting.Contract.Dto.ImportConfiguration;
using Accounting.Contract.Entity;
using ImportConfiguration = Accounting.Contract.Entity.ImportConfiguration;

namespace Accounting.Contract.Service;

public interface IImportConfigurationService
{
    public Task AddMissingDataTypeFieldsAsync(DataType dataType);
    
    public Task<ImportConfiguration> CreateAsync(ImportConfigurationCreateRequest request);

    public Task DeleteAsync(ImportConfigurationDeleteRequest request);

    public Task EditAsync(ImportConfigurationEditRequest request);

    public Task<ImportConfiguration> GetAsync(ImportConfigurationGetRequest request);

    public Task<IList<ImportConfiguration>> GetAsync(ImportConfigurationGetBySomeIdRequest request);
}