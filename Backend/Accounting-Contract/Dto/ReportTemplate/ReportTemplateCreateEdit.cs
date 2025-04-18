namespace Accounting.Contract.Dto.ReportTemplate;

public class ReportTemplateCreateEdit
{
    public IList<int> Fields { get; set; }
    public int Id { get; set; }
    public string Name { get; set; }
}