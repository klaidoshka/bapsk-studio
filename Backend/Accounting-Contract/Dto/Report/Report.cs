namespace Accounting.Contract.Dto.Report;

public class Report
{
    public IList<ReportEntry> Entries { get; set; } = new List<ReportEntry>();
    public IList<string> Header { get; set; } = new List<string>();
    public ReportInfo Info { get; set; } = new();
}