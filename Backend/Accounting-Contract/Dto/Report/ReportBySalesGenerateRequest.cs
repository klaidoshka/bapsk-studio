namespace Accounting.Contract.Dto.Report;

public class ReportBySalesGenerateRequest
{
    public int CustomerId { get; set; }
    public DateTime From { get; set; }
    public int RequesterId { get; set; }
    public int SalesmanId { get; set; }
    public DateTime To { get; set; }
}