using Accounting.Contract;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Accounting.Contract.Service.Request;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class DataEntryFieldService : IDataEntryFieldService
{
    private readonly AccountingDatabase _database;

    public DataEntryFieldService(AccountingDatabase database)
    {
        _database = database;
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
            throw new ArgumentException("Field already exists in data entry.");
        }

        if (entry.DataType.Fields.All(f => f.Id != request.DataTypeFieldId))
        {
            throw new ArgumentException("Field does not exist in data type.");
        }

        // TODO: Add validation for field type value
        var field = (await _database.DataEntryFields.AddAsync(
            new DataEntryField
            {
                DataEntry = entry,
                DataTypeFieldId = request.DataTypeFieldId,
                Value = request.Value
            }
        )).Entity;

        await _database.SaveChangesAsync();

        return field;
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

        // TODO: Add validation for field type value

        field.Value = request.Value;

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