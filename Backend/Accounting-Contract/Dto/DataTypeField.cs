#region

using Accounting.Contract.Entity;

#endregion

namespace Accounting.Contract.Dto;

public class DataTypeField
{
    public int DataTypeId { get; set; }
    public string? DefaultValue { get; set; }
    public int Id { get; set; }
    public bool IsRequired { get; set; }
    public string Name { get; set; }
    public int? ReferenceId { get; set; }
    public FieldType Type { get; set; }
}

public static class DataTypeFieldMappings
{
    public static DataTypeField ToDto(this Entity.DataTypeField entity)
    {
        return new DataTypeField
        {
            DataTypeId = entity.DataTypeId,
            DefaultValue = entity.DefaultValue,
            Id = entity.Id,
            IsRequired = entity.IsRequired,
            Name = entity.Name,
            ReferenceId = entity.ReferenceId,
            Type = entity.Type
        };
    }
}