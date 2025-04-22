using Accounting.Contract;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Validator;

public class ReportTemplateValidator : IReportTemplateValidator
{
    private readonly AccountingDatabase _database;

    public ReportTemplateValidator(AccountingDatabase database)
    {
        _database = database;
    }

    public async Task<bool> IsFromInstanceAsync(int id, int instanceId)
    {
        var template = await _database.ReportTemplates
            .Include(rt => rt.Fields)
            .ThenInclude(rt => rt.DataType)
            .FirstOrDefaultAsync(rt => rt.Id == id);

        return template?.IsDeleted == false && template.Fields.All(f => f.DataType.InstanceId == instanceId);
    }
}