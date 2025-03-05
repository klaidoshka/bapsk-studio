using Accounting.Contract;
using Accounting.Contract.Request;
using Accounting.Contract.Response;
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
            .FirstOrDefaultAsync(dt => dt.Id == request.DataTypeId);

        if (dataType == null || dataType.IsDeleted)
        {
            return new Validation("Data type not found.");
        }

        if (dataType.Instance.CreatedById != request.RequesterId)
        {
            return new Validation("You are not allowed to create data entries in this instance.");
        }

        var failures = new List<string>();

        foreach (var field in request.Fields)
        {
            failures.AddRange(
                (await ValidateDataEntryFieldCreateRequestAsync(field)).FailureMessages
            );
        }

        var requestFieldsById = request.Fields.ToDictionary(f => f.DataTypeFieldId);

        failures.AddRange(
            dataType.Fields
                .Where(
                    f =>
                        !requestFieldsById.ContainsKey(f.Id) &&
                        f.IsRequired &&
                        f.DefaultValue == null
                )
                .Select(field => $"Field '{field.Name}' is required, but not provided.")
                .ToList()
        );

        return new Validation(failures);
    }

    public async Task<Validation> ValidateDataEntryDeleteRequestAsync(
        DataEntryDeleteRequest request
    )
    {
        var dataEntry = await _database.DataEntries
            .Include(de => de.DataType)
            .ThenInclude(dt => dt.Instance)
            .FirstOrDefaultAsync(de => de.Id == request.DataEntryId);

        if (dataEntry == null || dataEntry.IsDeleted)
        {
            return new Validation("Data entry not found.");
        }

        return dataEntry.DataType.Instance.CreatedById != request.RequesterId
            ? new Validation("You are not allowed to delete this data entry.")
            : new Validation();
    }

    public async Task<Validation> ValidateDataEntryEditRequestAsync(DataEntryEditRequest request)
    {
        var dataEntry = await _database.DataEntries
            .Include(de => de.DataType)
            .ThenInclude(dt => dt.Instance)
            .FirstOrDefaultAsync(de => de.Id == request.DataEntryId);

        if (dataEntry == null || dataEntry.IsDeleted)
        {
            return new Validation("Data entry not found.");
        }

        if (dataEntry.DataType.Instance.CreatedById != request.RequesterId)
        {
            return new Validation("You are not allowed to edit this data entry.");
        }

        var failures = new List<string>();

        foreach (var field in request.Fields)
        {
            failures.AddRange(
                (await ValidateDataEntryFieldEditRequestAsync(field)).FailureMessages
            );
        }

        return new Validation(failures);
    }

    public async Task<Validation> ValidateDataEntryGetRequestAsync(DataEntryGetRequest request)
    {
        var dataEntry = await _database.DataEntries
            .Include(de => de.DataType)
            .ThenInclude(dt => dt.Instance)
            .ThenInclude(i => i.UserMetas)
            .FirstOrDefaultAsync(de => de.Id == request.DataEntryId);

        if (dataEntry == null || dataEntry.IsDeleted)
        {
            return new Validation("Data entry not found.");
        }

        return dataEntry.DataType.Instance.UserMetas.All(um => um.UserId != request.RequesterId)
            ? new Validation("You are not allowed to view this data entry.")
            : new Validation();
    }

    public async Task<Validation> ValidateDataEntryGetByDataTypeRequestAsync(
        DataEntryGetByDataTypeRequest request
    )
    {
        var dataType = await _database.DataTypes
            .Include(dt => dt.Instance)
            .ThenInclude(i => i.UserMetas)
            .FirstOrDefaultAsync(dt => dt.Id == request.DataTypeId);

        if (dataType == null || dataType.IsDeleted)
        {
            return new Validation("Data type not found.");
        }

        return dataType.Instance.UserMetas.All(um => um.UserId != request.RequesterId)
            ? new Validation("You are not allowed to view data entries in this instance.")
            : new Validation();
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
            _fieldTypeValidator.ValidateValue(dataTypeField, request.Value).FailureMessages
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
            _fieldTypeValidator.ValidateValue(dataTypeField, request.Value).FailureMessages
        );
    }
}