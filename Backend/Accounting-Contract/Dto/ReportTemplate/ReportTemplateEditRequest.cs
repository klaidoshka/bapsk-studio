namespace Accounting.Contract.Dto.ReportTemplate;

public class ReportTemplateEditRequest
{
    public ReportTemplate ReportTemplate { get; set; }
    public int RequesterId { get; set; }
}