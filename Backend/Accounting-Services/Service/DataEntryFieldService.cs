using Accounting.Contract;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Accounting.Contract.Service.Request;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class DataEntryFieldService : IDataEntryFieldService
{
    private readonly AccountingDatabase _database;
    private readonly IFieldTypeService _fieldTypeService;

    public DataEntryFieldService(AccountingDatabase database, IFieldTypeService fieldTypeService)
    {
        _database = database;
        _fieldTypeService = fieldTypeService;
    }

    public async Task<DataEntryField> CreateAsync(DataEntryFieldCreateRequest request)
    {
        var entry = await _database.DataEntries
                        .Include(de => de.Fields)
                        .Include(de => de.DataType)
                        .ThenInclude(dt => dt.Fields)
                        .FirstOrDefaultAsync(de => de.Id == request.DataEntryId)
                    ?? throw new ArgumentException("Data entry not found.");

        if (entry.Fields.Any(f => f.DataTypeFieldId == request.DataTypeFieldId))
        {
            throw new ArgumentException("Field already defined in data entry.");
        }

        var typeField = entry.DataType.Fields.FirstOrDefault(f => f.Id == request.DataTypeFieldId)
                        ?? throw new ArgumentException("Field does not exist in data type.");

        _fieldTypeService
            .ValidateValue(typeField, request.Value)
            .AssertValid();

        var entryField = (await _database.DataEntryFields.AddAsync(
            new DataEntryField
            {
                DataEntry = entry,
                DataTypeFieldId = request.DataTypeFieldId,
                Value = _fieldTypeService.Serialize(typeField.Type, request.Value)
            }
        )).Entity;

        await _database.SaveChangesAsync();

        return entryField;
    }

    public async Task DeleteAsync(int id)
    {
        var field = await _database.DataEntryFields
                        .Include(de => de.DataTypeField)
                        .FirstOrDefaultAsync(de => de.Id == id)
                    ?? throw new ArgumentException("Field not found.");

        if (field.DataTypeField.DefaultValue == null)
        {
            throw new ArgumentException("Cannot delete a required field from data entry.");
        }

        _database.DataEntryFields.Remove(field);

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(DataEntryFieldEditRequest request)
    {
        var field = await _database.DataEntryFields
                        .Include(de => de.DataTypeField)
                        .FirstOrDefaultAsync(de => de.Id == request.Id)
                    ?? throw new ArgumentException("Field not found.");

        _fieldTypeService
            .ValidateValue(field.DataTypeField.Type, request.Value)
            .AssertValid();

        field.Value = _fieldTypeService.Serialize(field.DataTypeField.Type, request.Value);

        await _database.SaveChangesAsync();
    }

    public async Task<DataEntryField> GetAsync(int id)
    {
        return await _database.DataEntryFields.FindAsync(id)
               ?? throw new ArgumentException("Field not found.");
    }

    public async Task<IEnumerable<DataEntryField>> GetByDataEntryIdAsync(int dataEntryId)
    {
        return await _database.DataEntryFields
            .Where(de => de.DataEntryId == dataEntryId)
            .ToListAsync();
    }
}