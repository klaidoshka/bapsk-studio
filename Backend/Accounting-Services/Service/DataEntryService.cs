using Accounting.Contract;
using Accounting.Contract.Entity;
using Accounting.Contract.Request;
using Accounting.Contract.Response;
using Accounting.Contract.Service;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class DataEntryService : IDataEntryService
{
    private readonly AccountingDatabase _database;
    private readonly IFieldTypeService _fieldTypeService;

    public DataEntryService(AccountingDatabase database, IFieldTypeService fieldTypeService)
    {
        _database = database;
        _fieldTypeService = fieldTypeService;
    }

    public async Task<DataEntry> CreateAsync(DataEntryCreateRequest request)
    {
        var dataType = await _database.DataTypes
                           .Include(dt => dt.Instance)
                           .ThenInclude(i => i.CreatedBy)
                           .Include(dt => dt.Fields)
                           .FirstOrDefaultAsync(dt => dt.Id == request.DataTypeId)
                       ?? throw new ValidationException("Data type not found.");

        _fieldTypeService
            .ValidateValues(dataType.Fields, request.Values)
            .AssertValid();

        var fields = dataType.Fields
            .Select(
                f =>
                {
                    if (request.Values.TryGetValue(f.Id, out var value))
                    {
                        return new DataEntryField
                        {
                            DataTypeField = f,
                            Value = _fieldTypeService.Serialize(f.Type, value)
                        };
                    }

                    return f.DefaultValue == null
                        ? null
                        : new DataEntryField
                        {
                            DataTypeField = f,
                            Value = f.DefaultValue
                        };
                }
            )
            .Where(f => f is not null)
            .ToList();

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

    public async Task DeleteAsync(int id, int managerId)
    {
        var entry = await _database.DataEntries.FindAsync(id)
                    ?? throw new ValidationException("Data entry not found.");

        if (entry.IsDeleted == true)
        {
            return;
        }

        entry.IsDeleted = true;
        entry.ModifiedAt = DateTime.UtcNow;
        entry.ModifiedById = managerId;

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(DataEntryEditRequest request)
    {
        var entry = await _database.DataEntries
                        .Include(de => de.DataType)
                        .ThenInclude(dt => dt.Instance)
                        .ThenInclude(i => i.CreatedBy)
                        .Include(de => de.DataType.Fields)
                        .Include(de => de.Fields)
                        .ThenInclude(f => f.DataTypeField)
                        .FirstOrDefaultAsync(de => de.Id == request.Id);

        if (entry == null || entry.IsDeleted == true)
        {
            throw new ValidationException("Data entry not found.");
        }

        _fieldTypeService
            .ValidateValues(entry.DataType.Fields, request.Values)
            .AssertValid();

        foreach (var field in entry.Fields)
        {
            if (request.Values.TryGetValue(field.DataTypeFieldId, out var value))
            {
                field.Value = _fieldTypeService.Serialize(field.DataTypeField.Type, value);
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

    public async Task<DataEntry> GetAsync(int id)
    {
        var dataEntry = await _database.DataEntries.FindAsync(id);

        if (dataEntry == null || dataEntry.IsDeleted == true)
        {
            throw new ValidationException("Data entry not found.");
        }

        return dataEntry;
    }

    public async Task<IEnumerable<DataEntry>> GetByDataTypeIdAsync(int dataTypeId)
    {
        return await _database.DataEntries
            .Where(
                de => de.DataTypeId == dataTypeId &&
                      de.IsDeleted != true
            )
            .ToListAsync();
    }
}