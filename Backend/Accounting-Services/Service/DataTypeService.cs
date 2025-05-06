using Accounting.Contract;
using Accounting.Contract.Dto.DataType;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Accounting.Services.Util;
using Microsoft.EntityFrameworkCore;
using DataType = Accounting.Contract.Entity.DataType;
using DataTypeField = Accounting.Contract.Entity.DataTypeField;

namespace Accounting.Services.Service;

public class DataTypeService : IDataTypeService
{
    private readonly AccountingDatabase _database;
    private readonly IDataEntryService _dataEntryService;
    private readonly IDataTypeValidator _dataTypeValidator;
    private readonly IFieldTypeService _fieldTypeService;
    private readonly IImportConfigurationService _importConfigurationService;

    public DataTypeService(
        AccountingDatabase database,
        IDataEntryService dataEntryService,
        IDataTypeValidator dataTypeValidator,
        IFieldTypeService fieldTypeService,
        IImportConfigurationService importConfigurationService
    )
    {
        _database = database;
        _dataEntryService = dataEntryService;
        _dataTypeValidator = dataTypeValidator;
        _fieldTypeService = fieldTypeService;
        _importConfigurationService = importConfigurationService;
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
                    DefaultValue = field.DefaultValue.IsNull()
                        ? null
                        : _fieldTypeService.Serialize(field.Type, field.DefaultValue),
                    IsRequired = field.IsRequired,
                    Name = field.Name,
                    ReferenceId = field.Type == FieldType.Reference ? field.ReferenceId : null,
                    Type = field.Type
                }
            );
        }

        await _database.SaveChangesAsync();

        return dataType;
    }

    public async Task DeleteAsync(DataTypeDeleteRequest request)
    {
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

        // Update data-type
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

        // Update existing fields
        foreach (var field in matchedFields.Values)
        {
            field.Matched.DefaultValue = field.New.DefaultValue.IsNull()
                ? null
                : _fieldTypeService.Serialize(field.New.Type, field.New.DefaultValue);

            field.Matched.IsRequired = field.New.IsRequired;
            field.Matched.Name = field.New.Name;
            field.Matched.ReferenceId = field.New.Type == FieldType.Reference ? field.New.ReferenceId : null;
            field.Matched.Type = field.New.Type;
        }

        // Remove fields that are no more in the request
        dataType.Fields
            .Where(f => !requestFieldsById.ContainsKey(f.Id))
            .ToList()
            .ForEach(f => _database.DataTypeFields.Remove(f));

        // Add new fields
        var newFields = request.Fields
            .Where(rf => !matchedFields.ContainsKey(rf.DataTypeFieldId ?? -1))
            .ToList();

        foreach (var field in newFields)
        {
            await _database.DataTypeFields.AddAsync(
                new DataTypeField
                {
                    DataTypeId = dataType.Id,
                    DefaultValue = field.DefaultValue.IsNull()
                        ? null
                        : _fieldTypeService.Serialize(field.Type, field.DefaultValue),
                    IsRequired = field.IsRequired,
                    Name = field.Name,
                    ReferenceId = field.Type == FieldType.Reference ? field.ReferenceId : null,
                    Type = field.Type
                }
            );
        }

        await _database.SaveChangesAsync();

        if (newFields.Count > 0)
        {
            await _dataEntryService.AddMissingDataTypeFieldsWithoutSaveAsync(dataType.Id);
            await _importConfigurationService.AddMissingDataTypeFieldsWithoutSaveAsync(dataType.Id);
        }

        dataType.DisplayFieldId = request.DisplayFieldIndex is not null
            ? dataType.Fields.ElementAtOrDefault(request.DisplayFieldIndex.Value)?.Id
            : null;

        await _database.SaveChangesAsync();
    }

    public async Task<DataType> GetAsync(DataTypeGetRequest request)
    {
        return await _database.DataTypes
            .Include(dt => dt.Fields)
            .FirstAsync(dt => dt.Id == request.DataTypeId);
    }

    public async Task<IList<DataType>> GetAsync(
        DataTypeGetByInstanceRequest request
    )
    {
        return await _database.DataTypes
            .Include(dt => dt.Fields)
            .Where(dt => dt.InstanceId == request.InstanceId && !dt.IsDeleted)
            .ToListAsync();
    }
}