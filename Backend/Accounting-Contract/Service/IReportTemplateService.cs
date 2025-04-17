using Accounting.Contract.Dto.ReportTemplate;
using ReportTemplate = Accounting.Contract.Entity.ReportTemplate;

namespace Accounting.Contract.Service;

public interface IReportTemplateService
{
    public Task<ReportTemplate> CreateAsync(ReportTemplateCreateRequest request);

    public Task DeleteAsync(ReportTemplateDeleteRequest request);

    public Task EditAsync(ReportTemplateEditRequest request);

    public Task<ReportTemplate> GetAsync(ReportTemplateGetRequest request);
}