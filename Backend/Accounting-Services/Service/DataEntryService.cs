using Accounting.Contract;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.DataEntry;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;
using DataEntry = Accounting.Contract.Entity.DataEntry;
using DataEntryField = Accounting.Contract.Entity.DataEntryField;

namespace Accounting.Services.Service;

public class DataEntryService : IDataEntryService
{
    private readonly ICsvService _csvService;
    private readonly AccountingDatabase _database;
    private readonly IDataEntryValidator _dataEntryValidator;
    private readonly IFieldTypeService _fieldTypeService;
    private readonly IFieldTypeValidator _fieldTypeValidator;

    public DataEntryService(
        ICsvService csvService,
        AccountingDatabase database,
        IDataEntryValidator dataEntryValidator,
        IFieldTypeService fieldTypeService,
        IFieldTypeValidator fieldTypeValidator
    )
    {
        _csvService = csvService;
        _database = database;
        _dataEntryValidator = dataEntryValidator;
        _fieldTypeService = fieldTypeService;
        _fieldTypeValidator = fieldTypeValidator;
    }

    public async Task AddMissingDataTypeFieldsWithoutSaveAsync(int dataTypeId)
    {
        var dataType = await _database.DataTypes
            .Include(it => it.Fields)
            .Include(it => it.Entries)
            .ThenInclude(it => it.Fields)
            .AsSplitQuery()
            .FirstOrDefaultAsync(it => it.Id == dataTypeId);

        if (dataType is null)
        {
            return;
        }

        foreach (var dataEntry in dataType.Entries)
        {
            var missingFields = dataType.Fields
                .Select(it => it.Id)
                .Except(dataEntry.Fields.Select(it => it.Id))
                .Select(fieldId => dataType.Fields.First(it => it.Id == fieldId))
                .ToList();

            foreach (var field in missingFields)
            {
                dataEntry.Fields.Add(
                    new DataEntryField
                    {
                        DataEntry = dataEntry,
                        DataTypeField = field,
                        Value = field.DefaultValue!
                    }
                );
            }
        }
    }

    public async Task<DataEntry> CreateAsync(DataEntryCreateRequest request)
    {
        (await _dataEntryValidator.ValidateDataEntryCreateRequestAsync(request)).AssertValid();

        var dataType = await _database.DataTypes
            .Include(dt => dt.Instance)
            .ThenInclude(i => i.CreatedBy)
            .Include(dt => dt.Fields)
            .AsSplitQuery()
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
            .AsSplitQuery()
            .FirstAsync(de => de.Id == request.DataEntryId);

        var dataTypeFields = entry.DataType.Fields.ToDictionary(it => it.Id);
        var requestFieldsById = request.Fields.ToDictionary(f => f.DataEntryFieldId);

        foreach (var field in entry.Fields)
        {
            if (requestFieldsById.TryGetValue(field.Id, out var requestField))
            {
                field.Value = _fieldTypeService.Serialize(dataTypeFields[field.DataTypeFieldId].Type, requestField.Value);
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
        return await _database.DataEntries
            .Include(de => de.Fields)
            .Include(de => de.DataType)
            .ThenInclude(dt => dt.Fields)
            .AsSplitQuery()
            .FirstAsync(de => de.Id == request.DataEntryId);
    }

    public async Task<IList<DataEntry>> GetAsync(
        DataEntryGetByDataTypeRequest request
    )
    {
        var candidates = await _database.DataEntries
            .Include(de => de.Fields)
            .Include(de => de.DataType)
            .ThenInclude(dt => dt.Fields)
            .AsSplitQuery()
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

    public async Task<IList<DataEntry>> GetAsync(DataEntryGetWithinIntervalRequest request)
    {
        return await _database.DataEntries
            .Include(de => de.Fields)
            .Include(de => de.DataType)
            .ThenInclude(dt => dt.Fields)
            .AsSplitQuery()
            .Where(de => !de.IsDeleted &&
                         de.DataTypeId == request.DataTypeId &&
                         de.CreatedAt >= request.From &&
                         de.CreatedAt <= request.To
            )
            .OrderBy(de => de.CreatedAt)
            .ToListAsync();
    }

    public async Task<IList<DataEntry>> ImportAsync(DataEntryImportRequest request)
    {
        var configuration = await _database.ImportConfigurations
            .Include(it => it.Fields)
            .Include(it => it.DataType)
            .ThenInclude(it => it.Fields)
            .AsSplitQuery()
            .FirstOrDefaultAsync(it => it.Id == request.ImportConfigurationId);

        var instanceId = configuration?.DataType?.InstanceId;

        var user = await _database.InstanceUsers.FirstOrDefaultAsync(
            it => it.UserId == request.RequesterId && it.InstanceId == instanceId
        );

        if (user is null)
        {
            throw new ValidationException("You are not authorized to import data.");
        }

        if (configuration is null)
        {
            throw new ValidationException("Import configuration was not found.");
        }

        if (!_csvService.IsSupportedFileExtension(request.FileExtension))
        {
            throw new ValidationException(
                $"File is not supported. Provide any of the following: ${
                    String.Join(", ", _csvService.GetSupportedFileExtensions())
                }"
            );
        }

        var csv = _csvService.ReadCsv(request.FileStream, request.FileExtension, request.SkipHeader);
        var entries = ParseImportedFile(configuration, request.RequesterId, csv, out var dataTypeFieldById);

        (await ValidateImportedEntriesAsync(entries, dataTypeFieldById)).AssertValid();

        foreach (var entry in entries)
        {
            await _database.DataEntries.AddAsync(entry);
        }

        await _database.SaveChangesAsync();

        var entryIds = entries
            .Select(entry => entry.Id)
            .ToHashSet();

        var entryIdMin = entryIds.Min();

        return (await _database.DataEntries
                .Include(de => de.Fields)
                .Include(de => de.DataType)
                .ThenInclude(dt => dt.Fields)
                .AsSplitQuery()
                .Where(e => e.Id >= entryIdMin)
                .ToListAsync())
            .Where(e => entryIds.Contains(e.Id))
            .ToList();
    }

    private IList<DataEntry> ParseImportedFile(
        ImportConfiguration configuration,
        int userId,
        string[][] csv,
        out Dictionary<int, DataTypeField> dataTypeFieldById
    )
    {
        var entries = new List<DataEntry>();
        dataTypeFieldById = configuration.DataType.Fields.ToDictionary(it => it.Id);
        var fieldsByOrder = configuration.Fields.ToDictionary(it => it.Order);

        foreach (var row in csv)
        {
            var entry = new DataEntry
            {
                CreatedAt = DateTime.UtcNow,
                CreatedById = userId,
                DataTypeId = configuration.DataTypeId,
                ModifiedAt = DateTime.UtcNow,
                ModifiedById = userId,
                Fields = new List<DataEntryField>()
            };

            for (var i = 0; i < row.Length; i++)
            {
                if (!fieldsByOrder.TryGetValue(i, out var configurationField))
                {
                    continue;
                }

                var column = row[i];
                var dataTypeField = dataTypeFieldById[configurationField.DataTypeFieldId];

                var value = !String.IsNullOrWhiteSpace(column)
                    ? column
                    : configurationField.DefaultValue ?? dataTypeField.DefaultValue ?? "";

                entry.Fields.Add(
                    new DataEntryField
                    {
                        DataTypeFieldId = dataTypeField.Id,
                        Value = value
                    }
                );
            }

            entries.Add(entry);
        }

        return entries;
    }

    private async Task<Validation> ValidateImportedEntriesAsync(
        IList<DataEntry> entries,
        Dictionary<int, DataTypeField> dataTypeFieldById
    )
    {
        var failures = new List<string>();

        if (entries.Count == 0)
        {
            return new Validation("There was no data to import.");
        }

        for (var row = 0; row < entries.Count; row++)
        {
            var entry = entries[row];

            if (dataTypeFieldById.Count > entry.Fields.Count)
            {
                failures.Add($"Row {row + 1}: Not all fields were provided, ensure empty fields exist in the file.");

                continue;
            }

            for (var column = 0; column < entry.Fields.Count; column++)
            {
                var field = entry.Fields.ElementAt(column);
                var dataTypeField = dataTypeFieldById[field.DataTypeFieldId];

                var validation = await _fieldTypeValidator.ValidateAsync(
                    dataTypeField.Type,
                    field.Value
                );

                if (validation.IsValid)
                {
                    continue;
                }

                failures.AddRange(
                    validation.FailureMessages
                        .Select(it => $"Row {row + 1}, Column {column + 1} ({dataTypeField.Name}): {it}")
                        .ToList()
                );
            }
        }

        return new Validation(failures);
    }
}