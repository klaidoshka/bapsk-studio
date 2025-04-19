using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Report;

public class ReportInfoField
{
    public string Name { get; set; } = String.Empty;
    public FieldType Type { get; set; } = FieldType.Text;
    public string Value { get; set; } = String.Empty;
}