namespace Accounting.Contract.Dto.ImportConfiguration;

public class ImportConfiguration
{
    public int Id { get; set; }
    public string Name { get; set; }
    public IList<ImportConfigurationField> Fields { get; set; }
}