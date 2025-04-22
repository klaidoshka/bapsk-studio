using Accounting.Contract;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Validator;

public class ImportConfigurationValidator : IImportConfigurationValidator
{
    private readonly AccountingDatabase _database;

    public ImportConfigurationValidator(AccountingDatabase database)
    {
        _database = database;
    }

    public async Task<bool> IsFromInstanceAsync(int id, int instanceId)
    {
        var configuration = await _database.ImportConfigurations
            .Include(c => c.DataType)
            .FirstOrDefaultAsync(c => c.Id == id);

        return configuration?.DataType.IsDeleted == false && configuration.DataType.InstanceId == instanceId;
    }
}