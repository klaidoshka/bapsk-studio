namespace Accounting.Contract.Dto.DataEntry;

public class DataEntryImportRequest
{
    public int DataTypeId { get; set; }
    public string FileName { get; set; }
    public Stream FileStream { get; set; }
    public int ImportConfigurationId { get; set; }
    public int RequesterId { get; set; }
}