namespace Accounting.Contract.Dto.ReportTemplate;

public class ReportTemplateCreateRequest
{
    public ReportTemplate ReportTemplate { get; set; }
    public int RequesterId { get; set; }
}