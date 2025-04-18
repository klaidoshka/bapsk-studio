namespace Accounting.Contract.Dto.ImportConfiguration;

public class ImportConfiguration
{
    public int DataTypeId { get; set; }
    public int Id { get; set; }
    public string Name { get; set; }
    public IList<ImportConfigurationField> Fields { get; set; }
}

public static class ImportConfigurationExtensions
{
    public static ImportConfiguration ToDto(this Entity.ImportConfiguration configuration)
    {
        return new ImportConfiguration
        {
            DataTypeId = configuration.DataTypeId,
            Id = configuration.Id,
            Name = configuration.Name,
            Fields = configuration.Fields
                .Select(it => it.ToDto())
                .ToList()
        };
    }
}