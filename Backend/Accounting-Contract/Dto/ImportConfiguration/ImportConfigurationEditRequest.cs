namespace Accounting.Contract.Dto.ImportConfiguration;

public class ImportConfigurationEditRequest
{
    public ImportConfiguration ImportConfiguration { get; set; }
    public int RequesterId { get; set; }
}