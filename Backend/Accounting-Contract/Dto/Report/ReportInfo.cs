namespace Accounting.Contract.Dto.Report;

public class ReportInfo
{
    public IList<ReportInfoField> Fields { get; set; } = new List<ReportInfoField>();
}