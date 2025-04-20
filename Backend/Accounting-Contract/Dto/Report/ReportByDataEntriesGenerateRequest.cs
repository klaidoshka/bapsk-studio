namespace Accounting.Contract.Dto.Report;

public class ReportByDataEntriesGenerateRequest
{
    public DateTime From { get; set; }
    public int ReportTemplateId { get; set; }
    public int RequesterId { get; set; }
    public DateTime To { get; set; }
}