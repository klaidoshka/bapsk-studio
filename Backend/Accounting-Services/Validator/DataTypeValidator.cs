using Accounting.Contract;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.DataType;
using Accounting.Contract.Validator;
using Accounting.Services.Util;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Validator;

public class DataTypeValidator : IDataTypeValidator
{
    private readonly AccountingDatabase _database;
    private readonly IFieldTypeValidator _fieldTypeValidator;

    public DataTypeValidator(AccountingDatabase database, IFieldTypeValidator fieldTypeValidator)
    {
        _database = database;
        _fieldTypeValidator = fieldTypeValidator;
    }

    public async Task<Validation> ValidateDataTypeCreateRequestAsync(DataTypeCreateRequest request)
    {
        var instance = await _database.Instances.FindAsync(request.InstanceId);

        if (instance == null)
        {
            return new Validation("Instance was not found.");
        }

        if (instance.CreatedById != request.RequesterId)
        {
            return new Validation("You are not authorized to create data types in this instance.");
        }

        if (String.IsNullOrWhiteSpace(request.Name))
        {
            return new Validation("Data type name is required.");
        }

        if (
            await _database.DataTypes.AnyAsync(
                dt => dt.InstanceId == request.InstanceId &&
                      dt.Name.Equals(
                          request.Name,
                          StringComparison.OrdinalIgnoreCase
                      )
            )
        )
        {
            return new Validation("Such data type name already exists.");
        }

        if (!request.Fields.Any())
        {
            return new Validation("At least one field is required in data type.");
        }

        var failures = new List<string>();

        if (request.Fields.Any(f => String.IsNullOrWhiteSpace(f.Name)))
        {
            failures.Add("Fields must have their name set.");
        }

        var duplicates = request.Fields
            .GroupBy(f => f.Name.Trim())
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .ToList();

        if (duplicates.Count != 0)
        {
            failures.Add($"Duplicate field names: {String.Join(", ", duplicates)}");
        }

        foreach (var field in request.Fields)
        {
            failures.AddRange((await ValidateDataTypeFieldCreateRequestAsync(field)).FailureMessages);
        }

        return new Validation(failures);
    }

    public async Task<Validation> ValidateDataTypeDeleteRequestAsync(DataTypeDeleteRequest request)
    {
        var dataType = await _database.DataTypes
            .Include(dt => dt.Fields)
            .Include(dt => dt.Instance)
            .FirstOrDefaultAsync(dt => dt.Id == request.DataTypeId && !dt.IsDeleted);

        if (dataType == null || dataType.IsDeleted)
        {
            return new Validation("Data type was not found.");
        }

        return dataType.Instance.CreatedById != request.RequesterId
            ? new Validation("You are not authorized to delete this data type.")
            : new Validation();
    }

    public async Task<Validation> ValidateDataTypeEditRequestAsync(DataTypeEditRequest request)
    {
        var dataType = await _database.DataTypes
            .Include(dt => dt.Entries)
            .Include(dt => dt.Fields)
            .Include(dt => dt.Instance)
            .FirstOrDefaultAsync(dt => dt.Id == request.DataTypeId && !dt.IsDeleted);

        if (dataType == null || dataType.IsDeleted)
        {
            return new Validation("Data type was not found.");
        }

        if (dataType.Instance.CreatedById != request.RequesterId)
        {
            return new Validation("You are not authorized to edit this data type.");
        }

        if (String.IsNullOrWhiteSpace(request.Name))
        {
            return new Validation("Data type name is required.");
        }

        // Check for duplicate data type name
        if (
            await _database.DataTypes.AnyAsync(
                dt => dt.InstanceId == dataType.InstanceId &&
                      dt.Name.Equals(
                          request.Name,
                          StringComparison.OrdinalIgnoreCase
                      ) &&
                      dt.Id != request.DataTypeId
            )
        )
        {
            return new Validation("Such data type name already exists.");
        }

        if (!request.Fields.Any())
        {
            return new Validation("At least one field is required in data type.");
        }

        if (request.DisplayFieldIndex != null && (
                request.DisplayFieldIndex < 0 ||
                request.DisplayFieldIndex >= dataType.Fields.Count
            ))
        {
            return new Validation(
                "Data type display field index must be between 0 and the number of fields."
            );
        }

        var failures = new List<string>();

        // Check for fields with no name
        if (request.Fields.Any(f => String.IsNullOrWhiteSpace(f.Name)))
        {
            failures.Add("Fields must have their name set.");
        }

        // Look for duplicate field names
        var duplicates = request.Fields
            .GroupBy(f => f.Name.Trim())
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .ToList();

        if (duplicates.Count != 0)
        {
            failures.Add($"Duplicate field names: {String.Join(", ", duplicates)}");
        }

        var newFields = request.Fields
            .Where(f => f.DataTypeFieldId is 0 or null && f.DefaultValue.IsNullOrEmpty())
            .ToList();

        // Check for new fields that have no default value and entries already exist
        if (dataType.Entries.Count != 0 && newFields.Count != 0)
        {
            failures.AddRange(
                newFields
                    .Select(
                        f =>
                            $"New field '{f.Name}' has no default value to assign to existing entries."
                    )
                    .ToList()
            );

            return new Validation(failures);
        }

        // Validate field edits
        foreach (var field in request.Fields)
        {
            failures.AddRange((await ValidateDataTypeFieldEditRequestAsync(field)).FailureMessages);
        }

        return new Validation(failures);
    }

    public async Task<Validation> ValidateDataTypeGetRequestAsync(DataTypeGetRequest request)
    {
        var dataType = await _database.DataTypes
            .Include(dt => dt.Instance)
            .FirstOrDefaultAsync(dt => dt.Id == request.DataTypeId && !dt.IsDeleted);

        if (dataType == null || dataType.IsDeleted)
        {
            return new Validation("Data type was not found.");
        }

        return dataType.Instance.CreatedById != request.RequesterId
            ? new Validation("You are not authorized to view this data type.")
            : new Validation();
    }

    public async Task<Validation> ValidateDataTypeGetByInstanceRequestAsync(
        DataTypeGetByInstanceRequest request
    )
    {
        var instance = await _database.Instances
            .Include(it => it.UserMetas)
            .FirstOrDefaultAsync(it => it.Id == request.InstanceId && !it.IsDeleted);

        if (instance == null)
        {
            return new Validation("Instance was not found.");
        }

        var userIds = instance.UserMetas
            .Select(it => it.UserId)
            .ToHashSet();

        return !userIds.Contains(request.RequesterId)
            ? new Validation("You are not authorized to view data types in this instance.")
            : new Validation();
    }

    public async Task<Validation> ValidateDataTypeFieldCreateRequestAsync(DataTypeFieldCreateRequest request)
    {
        if (!request.DefaultValue.IsNullOrEmpty())
        {
            return new Validation(
                (await _fieldTypeValidator.ValidateAsync(request.Type, request.DefaultValue)).FailureMessages
            );
        }

        return new Validation();
    }

    public async Task<Validation> ValidateDataTypeFieldEditRequestAsync(DataTypeFieldEditRequest request)
    {
        if (!request.DefaultValue.IsNullOrEmpty())
        {
            var validation = await _fieldTypeValidator.ValidateAsync(request.Type, request.DefaultValue);

            if (!validation.IsValid)
            {
                return validation;
            }
        }

        var field = await _database.DataTypeFields
            .Include(it => it.DataType)
            .ThenInclude(it => it.Entries)
            .ThenInclude(it => it.Fields)
            .FirstOrDefaultAsync(it => it.Id == request.DataTypeFieldId);

        // Check if new type can be assigned
        if (field is null || field.Type == request.Type)
        {
            return new Validation();
        }

        var entryFields = field.DataType.Entries
            .Where(it => it.Fields.Any(f => f.DataTypeFieldId == field.Id))
            .Select(it => it.Fields.First(f => f.DataTypeFieldId == field.Id))
            .ToList();

        foreach (var entryField in entryFields)
        {
            var validation = await _fieldTypeValidator.ValidateAsync(request.Type, entryField.Value);

            if (!validation.IsValid)
            {
                return new Validation($"Field '{request.Name}': Existing values are not compatible with the new type {request.Type}.");
            }
        }

        return new Validation();
    }
}