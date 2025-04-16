namespace Accounting.Contract.Dto.DataEntry;

public class DataEntryImportRequest
{
    public string FileExtension { get; set; }
    public Stream FileStream { get; set; }
    public int ImportConfigurationId { get; set; }
    public int RequesterId { get; set; }
    public bool SkipHeader { get; set; }
}