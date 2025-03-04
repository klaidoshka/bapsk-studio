using Accounting.Contract;
using Accounting.Contract.Entity;
using Accounting.Contract.Request;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class DataTypeService : IDataTypeService
{
    private readonly AccountingDatabase _database;
    private readonly IDataTypeValidator _dataTypeValidator;
    private readonly IFieldTypeService _fieldTypeService;

    public DataTypeService(
        AccountingDatabase database,
        IDataTypeValidator dataTypeValidator,
        IFieldTypeService fieldTypeService
    )
    {
        _database = database;
        _dataTypeValidator = dataTypeValidator;
        _fieldTypeService = fieldTypeService;
    }

    public async Task<DataType> CreateAsync(DataTypeCreateRequest request)
    {
        (await _dataTypeValidator.ValidateDataTypeCreateRequestAsync(request)).AssertValid();

        var dataType = (await _database.DataTypes.AddAsync(
            new DataType
            {
                Description = request.Description,
                InstanceId = request.InstanceId,
                IsDeleted = false,
                Name = request.Name
            }
        )).Entity;

        dataType.Fields = new List<DataTypeField>();

        foreach (var field in request.Fields)
        {
            dataType.Fields.Add(
                new DataTypeField
                {
                    DataTypeId = dataType.Id,
                    DefaultValue = field.DefaultValue == null
                        ? null
                        : _fieldTypeService.Serialize(field.Type, field.DefaultValue),
                    IsRequired = field.IsRequired,
                    Name = request.Name,
                    Type = field.Type
                }
            );
        }

        await _database.SaveChangesAsync();

        return dataType;
    }

    public async Task DeleteAsync(DataTypeDeleteRequest request)
    {
        (await _dataTypeValidator.ValidateDataTypeDeleteRequestAsync(request)).AssertValid();

        var dataType = await _database.DataTypes
            .Include(dt => dt.Fields)
            .Include(dt => dt.Instance)
            .FirstAsync(dt => dt.Id == request.DataTypeId);

        dataType.IsDeleted = true;

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(DataTypeEditRequest request)
    {
        (await _dataTypeValidator.ValidateDataTypeEditRequestAsync(request)).AssertValid();

        var dataType = await _database.DataTypes
            .Include(dt => dt.Entries)
            .Include(dt => dt.Instance)
            .Include(dt => dt.Fields)
            .FirstAsync(dt => dt.Id == request.DataTypeId);

        dataType.Description = request.Description;
        dataType.Name = request.Name;

        var requestFieldsById = request.Fields
            .GroupBy(f => f.DataTypeFieldId ?? 0)
            .ToDictionary(g => g.Key);

        var matchedFields = dataType.Fields
            .Where(f => requestFieldsById.ContainsKey(f.Id))
            .ToDictionary(
                f => f.Id,
                f => new
                {
                    Matched = f,
                    New = requestFieldsById[f.Id].First()
                }
            );

        foreach (var field in matchedFields.Values)
        {
            field.Matched.DefaultValue = field.New.DefaultValue == null
                ? null
                : _fieldTypeService.Serialize(field.New.Type, field.New.DefaultValue);

            field.Matched.IsRequired = field.New.IsRequired;
            field.Matched.Name = field.New.Name;
            field.Matched.Type = field.New.Type;
        }

        var newFields = request.Fields
            .Where(rf => !matchedFields.ContainsKey(rf.DataTypeFieldId ?? 0))
            .ToList();

        foreach (var field in newFields)
        {
            dataType.Fields.Add(
                new DataTypeField
                {
                    DataTypeId = dataType.Id,
                    DefaultValue = field.DefaultValue == null
                        ? null
                        : _fieldTypeService.Serialize(field.Type, field.DefaultValue),
                    IsRequired = field.IsRequired,
                    Name = field.Name,
                    Type = field.Type
                }
            );
        }

        dataType.Fields
            .Where(f => !requestFieldsById.ContainsKey(f.Id))
            .ToList()
            .ForEach(f => { dataType.Fields.Remove(f); });

        await _database.SaveChangesAsync();
    }

    public async Task<DataType> GetAsync(DataTypeGetRequest request)
    {
        (await _dataTypeValidator.ValidateDataTypeGetRequestAsync(request)).AssertValid();

        return await _database.DataTypes
            .Include(dt => dt.Fields)
            .FirstAsync(dt => dt.Id == request.DataTypeId);
    }

    public async Task<IEnumerable<DataType>> GetByInstanceIdAsync(
        DataTypeGetByInstanceRequest request
    )
    {
        (await _dataTypeValidator.ValidateDataTypeGetByInstanceRequestAsync(request)).AssertValid();

        return await _database.DataTypes
            .Include(dt => dt.Fields)
            .Where(dt => dt.InstanceId == request.InstanceId && !dt.IsDeleted)
            .ToListAsync();
    }
}