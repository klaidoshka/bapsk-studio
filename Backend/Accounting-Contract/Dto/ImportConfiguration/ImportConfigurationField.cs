namespace Accounting.Contract.Dto.ImportConfiguration;

public class ImportConfigurationField
{
    public int DataTypeFieldId { get; set; }
    public string? DefaultValue { get; set; }
    public int Id { get; set; }
    public int Order { get; set; }
}

public static class ImportConfigurationFieldExtensions
{
    public static ImportConfigurationField ToDto(this Entity.ImportConfigurationField field)
    {
        return new ImportConfigurationField
        {
            DataTypeFieldId = field.DataTypeFieldId,
            DefaultValue = field.DefaultValue,
            Id = field.Id,
            Order = field.Order
        };
    }
    
    public static Entity.ImportConfigurationField ToEntity(this ImportConfigurationField field)
    {
        return new Entity.ImportConfigurationField
        {
            DataTypeFieldId = field.DataTypeFieldId,
            DefaultValue = field.DefaultValue,
            Id = field.Id,
            Order = field.Order
        };
    }
}