namespace Accounting.Contract.Dto.ReportTemplate;

public class ReportTemplateGetByInstanceIdRequest
{
    public int InstanceId { get; set; }
    public int RequesterId { get; set; }
}