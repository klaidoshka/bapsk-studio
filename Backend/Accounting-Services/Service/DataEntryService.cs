using Accounting.Contract;
using Accounting.Contract.Dto.DataEntry;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;
using DataEntry = Accounting.Contract.Entity.DataEntry;
using DataEntryField = Accounting.Contract.Entity.DataEntryField;

namespace Accounting.Services.Service;

public class DataEntryService : IDataEntryService
{
    private readonly AccountingDatabase _database;
    private readonly IDataEntryValidator _dataEntryValidator;
    private readonly IFieldTypeService _fieldTypeService;

    public DataEntryService(
        AccountingDatabase database,
        IDataEntryValidator dataEntryValidator,
        IFieldTypeService fieldTypeService
    )
    {
        _database = database;
        _dataEntryValidator = dataEntryValidator;
        _fieldTypeService = fieldTypeService;
    }

    public async Task<DataEntry> CreateAsync(DataEntryCreateRequest request)
    {
        (await _dataEntryValidator.ValidateDataEntryCreateRequestAsync(request)).AssertValid();

        var dataType = await _database.DataTypes
            .Include(dt => dt.Instance)
            .ThenInclude(i => i.CreatedBy)
            .Include(dt => dt.Fields)
            .FirstAsync(dt => dt.Id == request.DataTypeId);

        var requestFieldsById = request.Fields.ToDictionary(f => f.DataTypeFieldId);
        var fields = new List<DataEntryField>();

        foreach (var field in dataType.Fields)
        {
            if (requestFieldsById.TryGetValue(field.Id, out var requestField))
            {
                fields.Add(
                    new DataEntryField
                    {
                        DataTypeField = field,
                        Value = _fieldTypeService.Serialize(field.Type, requestField.Value)
                    }
                );
            }
            else if (field.DefaultValue != null)
            {
                fields.Add(
                    new DataEntryField
                    {
                        DataTypeField = field,
                        Value = field.DefaultValue
                    }
                );
            }
        }

        var dataEntry = (await _database.DataEntries.AddAsync(
            new DataEntry
            {
                CreatedAt = DateTime.UtcNow,
                CreatedBy = dataType.Instance.CreatedBy,
                DataType = dataType,
                Fields = fields,
                ModifiedAt = DateTime.UtcNow,
                ModifiedBy = dataType.Instance.CreatedBy
            }
        )).Entity;

        await _database.SaveChangesAsync();

        return dataEntry;
    }

    public async Task DeleteAsync(DataEntryDeleteRequest request)
    {
        (await _dataEntryValidator.ValidateDataEntryDeleteRequestAsync(request)).AssertValid();

        var entry = await _database.DataEntries.FirstAsync(de => de.Id == request.DataEntryId);

        entry.IsDeleted = true;
        entry.ModifiedAt = DateTime.UtcNow;
        entry.ModifiedById = request.RequesterId;

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(DataEntryEditRequest request)
    {
        (await _dataEntryValidator.ValidateDataEntryEditRequestAsync(request)).AssertValid();

        var entry = await _database.DataEntries
            .Include(de => de.DataType)
            .ThenInclude(dt => dt.Instance)
            .ThenInclude(i => i.CreatedBy)
            .Include(de => de.DataType.Fields)
            .Include(de => de.Fields)
            .ThenInclude(f => f.DataTypeField)
            .FirstAsync(de => de.Id == request.DataEntryId);

        var requestFieldsById = request.Fields.ToDictionary(f => f.DataEntryFieldId);

        foreach (var field in entry.Fields)
        {
            if (requestFieldsById.TryGetValue(field.Id, out var requestField))
            {
                field.Value =
                    _fieldTypeService.Serialize(field.DataTypeField.Type, requestField.Value);
            }
            else
            {
                _database.DataEntryFields.Remove(field);
            }
        }

        entry.ModifiedAt = DateTime.UtcNow;
        entry.ModifiedBy = entry.DataType.Instance.CreatedBy;

        await _database.SaveChangesAsync();
    }

    public async Task<DataEntry> GetAsync(DataEntryGetRequest request)
    {
        (await _dataEntryValidator.ValidateDataEntryGetRequestAsync(request)).AssertValid();

        var candidate = await _database.DataEntries
            .Include(de => de.Fields)
            .ThenInclude(f => f.DataTypeField)
            .Include(de => de.DataType)
            .ThenInclude(dt => dt.Fields)
            .FirstAsync(de => de.Id == request.DataEntryId);

        var fieldsById = candidate.Fields.ToDictionary(f => f.DataTypeFieldId);

        foreach (var field in candidate.DataType.Fields)
        {
            if (!fieldsById.ContainsKey(field.Id))
            {
                candidate.Fields.Add(
                    new DataEntryField
                    {
                        DataTypeField = field,
                        Value = field.DefaultValue ?? String.Empty
                    }
                );
            }
        }

        return candidate;
    }

    public async Task<IEnumerable<DataEntry>> GetByDataTypeIdAsync(
        DataEntryGetByDataTypeRequest request
    )
    {
        (await _dataEntryValidator.ValidateDataEntryGetByDataTypeRequestAsync(request))
            .AssertValid();

        var candidates = await _database.DataEntries
            .Include(de => de.Fields)
            .ThenInclude(f => f.DataTypeField)
            .Include(de => de.DataType)
            .ThenInclude(dt => dt.Fields)
            .Where(de => de.DataTypeId == request.DataTypeId && !de.IsDeleted)
            .ToListAsync();

        foreach (var candidate in candidates)
        {
            var fieldsById = candidate.Fields.ToDictionary(f => f.DataTypeFieldId);

            foreach (var field in candidate.DataType.Fields)
            {
                if (!fieldsById.ContainsKey(field.Id))
                {
                    candidate.Fields.Add(
                        new DataEntryField
                        {
                            DataTypeField = field,
                            Value = field.DefaultValue ?? String.Empty
                        }
                    );
                }
            }
        }

        return candidates;
    }
}