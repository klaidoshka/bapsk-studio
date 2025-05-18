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
        if (String.IsNullOrWhiteSpace(request.Name))
        {
            return new Validation("Data type name is required.");
        }

        if (
            await _database.DataTypes.AnyAsync(dt => dt.InstanceId == request.InstanceId &&
                                                     !dt.IsDeleted &&
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

    public async Task<Validation> ValidateDataTypeEditRequestAsync(DataTypeEditRequest request)
    {
        var dataType = await _database.DataTypes
            .Include(dt => dt.Entries)
            .Include(dt => dt.Fields)
            .Include(dt => dt.Instance)
            .FirstAsync(dt => dt.Id == request.DataTypeId && !dt.IsDeleted);

        if (String.IsNullOrWhiteSpace(request.Name))
        {
            return new Validation("Data type name is required.");
        }

        if (
            await _database.DataTypes.AnyAsync(dt => dt.InstanceId == dataType.InstanceId &&
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

        var newFields = request.Fields
            .Where(f => f.DataTypeFieldId is 0 or null && f.DefaultValue.IsNullOrEmpty())
            .ToList();

        if (dataType.Entries.Count != 0 && newFields.Count != 0)
        {
            failures.AddRange(
                newFields
                    .Select(f =>
                        $"'{f.Name}': New field has no default value to assign to existing entries."
                    )
                    .ToList()
            );

            return new Validation(failures);
        }

        foreach (var field in request.Fields)
        {
            failures.AddRange((await ValidateDataTypeFieldEditRequestAsync(field)).FailureMessages);
        }

        return new Validation(failures);
    }

    public async Task<Validation> ValidateDataTypeFieldCreateRequestAsync(DataTypeFieldCreateRequest request)
    {
        if (!request.DefaultValue.IsNullOrEmpty())
        {
            return new Validation(
                (await _fieldTypeValidator.ValidateAsync(request.Type, request.DefaultValue)).FailureMessages
            );
        }

        return !request.IsRequired ? new Validation($"'{request.Name}': Default value is required for optional field.") : new Validation();
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
        else if (!request.IsRequired)
        {
            return new Validation($"'{request.Name}': Default value is required for optional field.");
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
                return new Validation(
                    $"'{request.Name}': Existing values are not compatible with the new type {request.Type}."
                );
            }
        }

        return new Validation();
    }

    public async Task<bool> IsFromInstanceAsync(int id, int instanceId)
    {
        var dataType = await _database.DataTypes.FindAsync(id);

        if (dataType?.IsDeleted == true)
        {
            throw new KeyNotFoundException("Data type was not found.");
        }

        return dataType?.IsDeleted == false && dataType.InstanceId == instanceId;
    }
}