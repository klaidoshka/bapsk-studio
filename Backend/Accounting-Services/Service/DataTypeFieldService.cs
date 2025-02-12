using Accounting.Contract;
using Accounting.Contract.Entity;
using Accounting.Contract.Request;
using Accounting.Contract.Response;
using Accounting.Contract.Service;
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

    public async Task<DataTypeField> CreateAsync(DataTypeFieldCreateRequest request)
    {
        var dataType = await _database.DataTypes
                           .Include(dt => dt.Fields)
                           .FirstOrDefaultAsync(dt => dt.Id == request.DataTypeId)
                       ?? throw new ValidationException("Data type not found.");

        if (dataType.InstanceId != request.InstanceId)
        {
            throw new ValidationException("Data type does not belong to this instance.");
        }

        var field = (await _database.DataTypeFields.AddAsync(
            new DataTypeField
            {
                DataTypeId = request.DataTypeId,
                DefaultValue = request.DefaultValue == null
                    ? null
                    : _fieldTypeService.Serialize(request.Type, request.DefaultValue),
                IsRequired = request.IsRequired ?? true,
                Name = request.Name,
                Type = request.Type
            }
        )).Entity;

        await _database.SaveChangesAsync();

        return field;
    }

    public async Task DeleteAsync(int id, int managerId)
    {
        var field = await _database.DataTypeFields
                        .Include(df => df.DataType)
                        .ThenInclude(dt => dt.Instance)
                        .FirstOrDefaultAsync(df => df.Id == id)
                    ?? throw new ValidationException("Field not found.");

        _database.DataTypeFields.Remove(field);

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(DataTypeFieldEditRequest request)
    {
        var field = await _database.DataTypeFields
                        .Include(df => df.DataType)
                        .ThenInclude(dt => dt.Instance)
                        .FirstOrDefaultAsync(df => df.Id == request.Id)
                    ?? throw new ValidationException("Field not found.");

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
               ?? throw new ValidationException("Field not found.");
    }

    public async Task<IEnumerable<DataTypeField>> GetByDataTypeIdAsync(int dataTypeId)
    {
        return await _database.DataTypeFields
            .Where(df => df.DataTypeId == dataTypeId)
            .ToListAsync();
    }
}