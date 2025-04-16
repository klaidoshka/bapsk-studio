namespace Accounting.Contract.Dto.ImportConfiguration;

public class ImportConfigurationGetBySomeIdRequest
{
    public int? DataTypeId { get; set; }
    public int? InstanceId { get; set; }
    public int RequesterId { get; set; }
}