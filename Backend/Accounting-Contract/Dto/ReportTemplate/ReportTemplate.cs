using Accounting.Contract.Dto.DataType;

namespace Accounting.Contract.Dto.ReportTemplate;

public class ReportTemplate
{
    public int CreatedById { get; set; }
    public IList<DataTypeField> Fields { get; set; }
    public int Id { get; set; }
    public string Name { get; set; }
}