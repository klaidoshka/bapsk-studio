namespace Accounting.Contract.Dto.ImportConfiguration;

public class ImportConfigurationCreateRequest
{
    public ImportConfiguration ImportConfiguration { get; set; }
    public int RequesterId { get; set; }
}