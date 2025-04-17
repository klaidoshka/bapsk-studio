namespace Accounting.Contract.Dto.ReportTemplate;

public class ReportTemplateCreateRequest
{
    public ReportTemplateCreateEdit ReportTemplate { get; set; }
    public int RequesterId { get; set; }
}