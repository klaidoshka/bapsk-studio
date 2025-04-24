using Accounting.Contract;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.DataEntry;
using Accounting.Contract.Validator;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Validator;

public class DataEntryValidator : IDataEntryValidator
{
    private readonly AccountingDatabase _database;
    private readonly IFieldTypeValidator _fieldTypeValidator;

    public DataEntryValidator(AccountingDatabase database, IFieldTypeValidator fieldTypeValidator)
    {
        _database = database;
        _fieldTypeValidator = fieldTypeValidator;
    }

    public async Task<Validation> ValidateDataEntryCreateRequestAsync(
        DataEntryCreateRequest request
    )
    {
        var dataType = await _database.DataTypes
            .Include(dt => dt.Instance)
            .Include(dt => dt.Fields)
            .FirstAsync(dt => dt.Id == request.DataTypeId);

        var failures = new List<string>();
        var requestFieldsById = request.Fields.ToDictionary(f => f.DataTypeFieldId);

        failures.AddRange(
            dataType.Fields
                .Where(f =>
                    !requestFieldsById.ContainsKey(f.Id) &&
                    f.IsRequired &&
                    f.DefaultValue == null
                )
                .Select(field => $"Field '{field.Name}' is required, but not provided.")
                .ToList()
        );

        foreach (var field in request.Fields)
        {
            failures.AddRange(
                (await ValidateDataEntryFieldCreateRequestAsync(field)).FailureMessages
            );
        }

        return new Validation(failures);
    }

    public async Task<Validation> ValidateDataEntryEditRequestAsync(DataEntryEditRequest request)
    {
        var failures = new List<string>();

        foreach (var field in request.Fields)
        {
            failures.AddRange(
                (await ValidateDataEntryFieldEditRequestAsync(field)).FailureMessages
            );
        }

        return new Validation(failures);
    }

    public async Task<Validation> ValidateDataEntryFieldCreateRequestAsync(
        DataEntryFieldCreateRequest request
    )
    {
        var dataTypeField = await _database.DataTypeFields
            .Include(f => f.DataType)
            .FirstOrDefaultAsync(f => f.Id == request.DataTypeFieldId);

        if (dataTypeField == null)
        {
            return new Validation("Field does not exist in data type.");
        }

        return new Validation(
            (await _fieldTypeValidator.ValidateAsync(dataTypeField, request.Value)).FailureMessages
        );
    }

    public async Task<Validation> ValidateDataEntryFieldEditRequestAsync(
        DataEntryFieldEditRequest request
    )
    {
        var dataEntryField = await _database.DataEntryFields
            .Include(def => def.DataTypeField)
            .ThenInclude(dtf => dtf.DataType)
            .ThenInclude(dt => dt.Fields)
            .FirstOrDefaultAsync(de => de.Id == request.DataEntryFieldId);

        if (dataEntryField == null)
        {
            return new Validation(
                $"Field with id {request.DataEntryFieldId} does not exist in data entry."
            );
        }

        var dataTypeField = dataEntryField.DataTypeField.DataType.Fields
            .FirstOrDefault(f => f.Id == dataEntryField.DataTypeFieldId);

        if (dataTypeField == null)
        {
            return new Validation(
                $"Field with id {request.DataEntryFieldId} does not belong to the data type of this data entry."
            );
        }

        return new Validation(
            (await _fieldTypeValidator.ValidateAsync(dataTypeField, request.Value)).FailureMessages
        );
    }

    public async Task<bool> IsFromInstanceAsync(int id, int instanceId)
    {
        var dataEntry = await _database.DataEntries
            .Include(de => de.DataType)
            .FirstOrDefaultAsync(de => de.Id == id);

        if (dataEntry?.IsDeleted == true)
        {
            throw new KeyNotFoundException("Data entry was not found.");
        }

        return dataEntry?.IsDeleted == false && !dataEntry.DataType.IsDeleted && dataEntry.DataType.InstanceId == instanceId;
    }
}