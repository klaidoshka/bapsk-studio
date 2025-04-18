namespace Accounting.Contract.Dto.Report;

public class Report
{
    public IList<IList<string>> Entries { get; set; } = new List<IList<string>>();
    public IList<string> Header { get; set; } = new List<string>();
    public IDictionary<string, string> Info { get; set; } = new Dictionary<string, string>();
}