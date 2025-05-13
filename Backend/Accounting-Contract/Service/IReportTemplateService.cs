using Accounting.Contract.Dto.ReportTemplate;
using Accounting.Contract.Entity;
using ReportTemplate = Accounting.Contract.Entity.ReportTemplate;

namespace Accounting.Contract.Service;

public interface IReportTemplateService
{
    public Task AddMissingDataTypeFieldsAsync(DataType dataType);
    
    public Task<ReportTemplate> CreateAsync(ReportTemplateCreateRequest request);

    public Task DeleteAsync(ReportTemplateDeleteRequest request);

    public Task EditAsync(ReportTemplateEditRequest request);

    public Task<ReportTemplate> GetAsync(ReportTemplateGetRequest request);

    public Task<int> GetInstanceIdAsync(int templateId);

    public Task<IList<ReportTemplate>> GetAsync(ReportTemplateGetByInstanceIdRequest request);
}