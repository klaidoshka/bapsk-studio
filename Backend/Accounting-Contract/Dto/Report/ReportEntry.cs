namespace Accounting.Contract.Dto.Report;

public class ReportEntry
{
    public IList<ReportEntryField> Fields { get; set; } = new List<ReportEntryField>();
}