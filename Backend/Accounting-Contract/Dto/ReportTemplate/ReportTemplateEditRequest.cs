namespace Accounting.Contract.Dto.ReportTemplate;

public class ReportTemplateEditRequest
{
    public ReportTemplateCreateEdit ReportTemplate { get; set; }
    public int RequesterId { get; set; }
}