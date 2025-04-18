using Accounting.Contract.Dto.DataType;

namespace Accounting.Contract.Dto.ReportTemplate;

public class ReportTemplate
{
    public int CreatedById { get; set; }
    public IList<DataTypeField> Fields { get; set; }
    public int Id { get; set; }
    public string Name { get; set; }
}

public static class ReportTemplateExtensions
{
    public static ReportTemplate ToDto(this Entity.ReportTemplate template)
    {
        return new ReportTemplate
        {
            CreatedById = template.CreatedById,
            Fields = template.Fields
                .Select(it => it.ToDto())
                .ToList(),
            Id = template.Id,
            Name = template.Name
        };
    }
}