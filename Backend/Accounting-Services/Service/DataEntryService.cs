using Accounting.Contract;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Accounting.Contract.Service.Request;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class DataEntryService : IDataEntryService
{
    private readonly AccountingDatabase _database;

    public DataEntryService(AccountingDatabase database)
    {
        _database = database;
    }

    public async Task<DataEntry> CreateAsync(DataEntryCreateRequest request)
    {
        var dataType = await _database.DataTypes
                           .Include(dt => dt.Instance)
                           .ThenInclude(i => i.CreatedBy)
                           .Include(dt => dt.Fields)
                           .FirstOrDefaultAsync(dt => dt.Id == request.DataTypeId)
                       ?? throw new ArgumentException("Data type not found.");

        if (dataType.Instance.CreatedById != request.CreatorId)
        {
            throw new ArgumentException("Creator does not have permission to create data entries in this instance.");
        }

        var fields = dataType.Fields
            .Select(
                f =>
                {
                    if (request.Values.TryGetValue(f.Id, out var value))
                    {
                        return new DataEntryField
                        {
                            DataTypeField = f,
                            Value = value
                        };
                    }

                    if (f.IsRequired)
                    {
                        throw new ArgumentException($"Field {f.Name} is missing required value.");
                    }

                    if (f.DefaultValue == null)
                    {
                        return null;
                    }

                    return new DataEntryField
                    {
                        DataTypeField = f,
                        Value = f.DefaultValue
                    };
                }
            )
            .Where(f => f is not null)
            .ToList();

        // TODO: Add validation for field type values

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

    public async Task DeleteAsync(int id)
    {
        var entry = await _database.DataEntries.FindAsync(id)
                    ?? throw new ArgumentException("Data entry not found.");

        if (entry.IsDeleted == true)
        {
            return;
        }

        entry.IsDeleted = true;

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(DataEntryEditRequest request)
    {
        var entry = await _database.DataEntries
                        .Include(de => de.DataType)
                        .ThenInclude(dt => dt.Instance)
                        .ThenInclude(i => i.CreatedBy)
                        .Include(de => de.Fields)
                        .FirstOrDefaultAsync(de => de.Id == request.Id)
                    ?? throw new ArgumentException("Data entry not found.");

        if (entry.DataType.Instance.CreatedById != request.ManagerId)
        {
            throw new ArgumentException("Manager does not have permission to edit this data entry.");
        }

        foreach (var field in entry.Fields)
        {
            if (request.Values.TryGetValue(field.DataTypeFieldId, out var value))
            {
                // TODO: Add validation for field type value
                field.Value = value;
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
        return await _database.DataEntries.FindAsync(id)
               ?? throw new ArgumentException("Data entry not found.");
    }

    public async Task<IEnumerable<DataEntry>> GetByDataTypeIdAsync(int dataTypeId)
    {
        return await _database.DataEntries
            .Where(de => de.DataTypeId == dataTypeId)
            .ToListAsync();
    }
}