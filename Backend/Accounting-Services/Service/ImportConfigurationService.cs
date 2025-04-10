using Accounting.Contract.Dto.ImportConfiguration;
using Accounting.Contract.Service;
using ImportConfiguration = Accounting.Contract.Entity.ImportConfiguration;

namespace Accounting.Services.Service;

public class ImportConfigurationService : IImportConfigurationService
{
    public async Task<ImportConfiguration> CreateAsync(ImportConfigurationCreateRequest request)
    {
        throw new NotImplementedException();
    }

    public async Task DeleteAsync(ImportConfigurationDeleteRequest request)
    {
        throw new NotImplementedException();
    }

    public async Task EditAsync(ImportConfigurationEditRequest request)
    {
        throw new NotImplementedException();
    }

    public async Task<ImportConfiguration> GetAsync(ImportConfigurationGetRequest request)
    {
        throw new NotImplementedException();
    }

    public async Task<IList<ImportConfiguration>> GetAsync(ImportConfigurationGetByInstanceRequest request)
    {
        throw new NotImplementedException();
    }
}