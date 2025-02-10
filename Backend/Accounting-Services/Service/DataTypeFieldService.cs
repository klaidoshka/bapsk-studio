using Accounting.Contract;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Accounting.Contract.Service.Request;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class DataTypeFieldService : IDataTypeFieldService
{
    private readonly AccountingDatabase _database;
    private readonly IFieldTypeService _fieldTypeService;

    public DataTypeFieldService(AccountingDatabase database, IFieldTypeService fieldTypeService)
    {
        _database = database;
        _fieldTypeService = fieldTypeService;
    }

    public async Task CreateAsync(DataTypeFieldCreateRequest request)
    {
        var instance = await _database.Instances
                           .Include(i => i.CreatedBy)
                           .FirstOrDefaultAsync(i => i.Id == request.InstanceId)
                       ?? throw new ArgumentException("Instance not found.");

        if (instance.CreatedBy.Id != request.ManagerId)
        {
            throw new ArgumentException("Manager does not have permission to add fields to this instance.");
        }

        var dataType = await _database.DataTypes
                           .Include(dt => dt.Fields)
                           .FirstOrDefaultAsync(dt => dt.Id == request.DataTypeId)
                       ?? throw new ArgumentException("Data type not found.");

        if (dataType.InstanceId != request.InstanceId)
        {
            throw new ArgumentException("Data type does not belong to this instance.");
        }

        var field = new DataTypeField
        {
            DataTypeId = request.DataTypeId,
            DefaultValue = request.DefaultValue == null
                ? null
                : _fieldTypeService.Serialize(request.Type, request.DefaultValue),
            IsRequired = request.IsRequired ?? true,
            Name = request.Name,
            Type = request.Type
        };

        await _database.DataTypeFields.AddAsync(field);

        await _database.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id, int managerId)
    {
        var field = await _database.DataTypeFields
                        .Include(df => df.DataType)
                        .ThenInclude(dt => dt.Instance)
                        .FirstOrDefaultAsync(df => df.Id == id)
                    ?? throw new ArgumentException("Field not found.");

        if (field.DataType.Instance.CreatedById != managerId)
        {
            throw new ArgumentException("Manager does not have permission to remove fields from this instance.");
        }

        _database.DataTypeFields.Remove(field);

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(DataTypeFieldEditRequest request)
    {
        var field = await _database.DataTypeFields
                        .Include(df => df.DataType)
                        .ThenInclude(dt => dt.Instance)
                        .FirstOrDefaultAsync(df => df.Id == request.Id)
                    ?? throw new ArgumentException("Field not found.");

        if (field.DataType.Instance.CreatedById != request.ManagerId)
        {
            throw new ArgumentException("Manager does not have permission to edit this field.");
        }

        field.DefaultValue = request.DefaultValue == null
            ? null
            : _fieldTypeService.Serialize(request.Type, request.DefaultValue);
        field.IsRequired = request.IsRequired ?? true;
        field.Name = request.Name;
        field.Type = request.Type;

        await _database.SaveChangesAsync();
    }

    public async Task<DataTypeField> GetAsync(int id)
    {
        return await _database.DataTypeFields.FindAsync(id)
               ?? throw new ArgumentException("Field not found.");
    }

    public async Task<IEnumerable<DataTypeField>> GetByDataTypeIdAsync(int dataTypeId)
    {
        return await _database.DataTypeFields
            .Where(df => df.DataTypeId == dataTypeId)
            .ToListAsync();
    }
}