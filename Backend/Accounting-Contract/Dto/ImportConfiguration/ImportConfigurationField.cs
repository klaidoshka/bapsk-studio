using System.Text.Json;

namespace Accounting.Contract.Dto.ImportConfiguration;

public class ImportConfigurationField
{
    public int DataTypeFieldId { get; set; }
    public JsonElement? DefaultValue { get; set; }
    public int? Id { get; set; }
    public int Order { get; set; }
}

public static class ImportConfigurationFieldExtensions
{
    public static ImportConfigurationField ToDto(this Entity.ImportConfigurationField field)
    {
        return new ImportConfigurationField
        {
            DataTypeFieldId = field.DataTypeFieldId,
            DefaultValue = JsonSerializer.SerializeToElement(field.DefaultValue),
            Id = field.Id,
            Order = field.Order
        };
    }
}