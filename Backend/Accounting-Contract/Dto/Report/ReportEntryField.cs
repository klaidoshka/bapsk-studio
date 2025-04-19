using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Report;

public class ReportEntryField
{
    public FieldType Type { get; set; } = FieldType.Text;
    public string Value { get; set; } = string.Empty;
}