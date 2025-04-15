namespace Accounting.API.Dto;

public class DataEntryImportRequest
{
    public int DataTypeId { get; set; }
    public IFormFile File { get; set; }
    public int ImportConfigurationId { get; set; }
}