using Accounting.Contract;
using Accounting.Contract.Request;
using Accounting.Contract.Response;
using Accounting.Contract.Validator;
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
            return new Validation("Instance not found.");
        }

        if (instance.CreatedById != request.RequesterId)
        {
            return new Validation("You are not allowed to create data types in this instance.");
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return new Validation("Data type name is required.");
        }

        if (
            await _database.DataTypes.AnyAsync(
                dt => dt.InstanceId == request.InstanceId &&
                      dt.Name.Equals(
                          request.Name,
                          StringComparison.InvariantCultureIgnoreCase
                      )
            )
        )
        {
            return new Validation("Such data type name already exists.");
        }

        if (!request.Fields.Any())
        {
            return new Validation("At least one field is required.");
        }

        var failures = new List<string>();

        if (request.Fields.Any(f => string.IsNullOrWhiteSpace(f.Name)))
        {
            failures.Add("Field must have a name.");
        }

        var duplicates = request.Fields
            .GroupBy(f => f.Name.Trim())
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .ToList();

        if (duplicates.Count != 0)
        {
            failures.Add($"Duplicate field names: {string.Join(", ", duplicates)}");
        }

        failures.AddRange(
            request.Fields.SelectMany(
                f => ValidateDataTypeFieldCreateRequest(f).FailureMessages
            )
        );

        return new Validation(failures);
    }

    public async Task<Validation> ValidateDataTypeDeleteRequestAsync(DataTypeDeleteRequest request)
    {
        var dataType = await _database.DataTypes
            .Include(dt => dt.Fields)
            .Include(dt => dt.Instance)
            .FirstOrDefaultAsync(dt => dt.Id == request.DataTypeId && !dt.IsDeleted);

        if (dataType == null)
        {
            return new Validation("Data type not found.");
        }

        return dataType.Instance.CreatedById != request.RequesterId
            ? new Validation("You are not allowed to delete this data type.")
            : new Validation();
    }

    public async Task<Validation> ValidateDataTypeEditRequestAsync(DataTypeEditRequest request)
    {
        var dataType = await _database.DataTypes
            .Include(dt => dt.Fields)
            .Include(dt => dt.Instance)
            .FirstOrDefaultAsync(dt => dt.Id == request.DataTypeId && !dt.IsDeleted);

        if (dataType == null)
        {
            return new Validation("Data type not found.");
        }

        if (dataType.Instance.CreatedById != request.RequesterId)
        {
            return new Validation("You are not allowed to edit this data type.");
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return new Validation("Data type name is required.");
        }

        if (
            await _database.DataTypes.AnyAsync(
                dt => dt.InstanceId == dataType.InstanceId &&
                      dt.Name.Equals(
                          request.Name,
                          StringComparison.InvariantCultureIgnoreCase
                      ) &&
                      dt.Id != request.DataTypeId
            )
        )
        {
            return new Validation("Such data type name already exists.");
        }

        var failures = new List<string>();

        if (request.Fields.Any(f => string.IsNullOrWhiteSpace(f.Name)))
        {
            failures.Add("Field must have a name.");
        }

        var duplicates = request.Fields
            .GroupBy(f => f.Name.Trim())
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .ToList();

        if (duplicates.Count != 0)
        {
            failures.Add($"Duplicate field names: {string.Join(", ", duplicates)}");
        }

        failures.AddRange(
            request.Fields.SelectMany(
                f => ValidateDataTypeFieldEditRequest(f).FailureMessages
            )
        );

        return new Validation(failures);
    }

    public async Task<Validation> ValidateDataTypeGetRequestAsync(DataTypeGetRequest request)
    {
        var dataType = await _database.DataTypes
            .Include(dt => dt.Instance)
            .FirstOrDefaultAsync(dt => dt.Id == request.DataTypeId && !dt.IsDeleted);

        if (dataType == null)
        {
            return new Validation("Data type not found.");
        }

        return dataType.Instance.CreatedById != request.RequesterId
            ? new Validation("You are not allowed to view this data type.")
            : new Validation();
    }

    public async Task<Validation> ValidateDataTypeGetByInstanceRequestAsync(DataTypeGetByInstanceRequest request)
    {
        var instance = await _database.Instances.FindAsync(request.InstanceId);

        if (instance == null)
        {
            return new Validation("Instance not found.");
        }

        return instance.CreatedById != request.RequesterId
            ? new Validation("You are not allowed to view data types in this instance.")
            : new Validation();
    }

    public Validation ValidateDataTypeFieldCreateRequest(DataTypeFieldCreateRequest request)
    {
        if (request.DefaultValue is not null)
        {
            return new Validation(
                _fieldTypeValidator.ValidateValue(request.Type, request.DefaultValue).FailureMessages
            );
        }

        return new Validation();
    }

    public Validation ValidateDataTypeFieldEditRequest(DataTypeFieldEditRequest request)
    {
        if (request.DefaultValue is not null)
        {
            return new Validation(
                _fieldTypeValidator.ValidateValue(request.Type, request.DefaultValue).FailureMessages
            );
        }

        return new Validation();
    }
}