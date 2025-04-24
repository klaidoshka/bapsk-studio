using Accounting.Contract;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.ImportConfiguration;
using Accounting.Contract.Service;
using Microsoft.EntityFrameworkCore;
using ImportConfiguration = Accounting.Contract.Entity.ImportConfiguration;
using ImportConfigurationField = Accounting.Contract.Entity.ImportConfigurationField;

namespace Accounting.Services.Service;

public class ImportConfigurationService : IImportConfigurationService
{
    private readonly AccountingDatabase _database;
    private readonly IFieldTypeService _fieldTypeService;
    private readonly IInstanceAuthorizationService _instanceAuthorizationService;

    public ImportConfigurationService(
        AccountingDatabase database,
        IFieldTypeService fieldTypeService,
        IInstanceAuthorizationService instanceAuthorizationService
    )
    {
        _database = database;
        _fieldTypeService = fieldTypeService;
        _instanceAuthorizationService = instanceAuthorizationService;
    }

    public async Task AddMissingDataTypeFieldsWithoutSaveAsync(int dataTypeId)
    {
        var dataType = await _database.DataTypes
            .Include(it => it.Fields)
            .FirstOrDefaultAsync(it => it.Id == dataTypeId);

        if (dataType is null)
        {
            return;
        }

        var configurations = await _database.ImportConfigurations
            .Include(it => it.Fields)
            .Where(it => it.DataTypeId == dataTypeId)
            .ToListAsync();

        var defaultValues = dataType.Fields.ToDictionary(it => it.Id, it => it.DefaultValue);

        foreach (var configuration in configurations)
        {
            var missingFieldIds = defaultValues.Keys
                .Except(
                    configuration.Fields
                        .Select(it => it.DataTypeFieldId)
                        .ToHashSet()
                )
                .ToList();

            foreach (var missingFieldId in missingFieldIds)
            {
                configuration.Fields.Add(
                    new ImportConfigurationField
                    {
                        DataTypeFieldId = missingFieldId,
                        DefaultValue = defaultValues[missingFieldId],
                        Order = configuration.Fields.Count
                    }
                );
            }
        }
    }

    public async Task<ImportConfiguration> CreateAsync(ImportConfigurationCreateRequest request)
    {
        var dataType = await _database.DataTypes
            .Include(it => it.Instance)
            .Include(it => it.Fields)
            .FirstOrDefaultAsync(it => it.Id == request.ImportConfiguration.DataTypeId);

        if (dataType is null || dataType.IsDeleted)
        {
            throw new ValidationException("Data type was not found.");
        }

        if (!await _instanceAuthorizationService.IsMemberAsync(dataType.InstanceId, request.RequesterId))
        {
            throw new ValidationException("You are not authorized to create import configurations.");
        }

        // Validate fields
        var dataTypeFields = dataType.Fields.ToDictionary(it => it.Id, it => it);

        var requestDataTypeFieldIds = request.ImportConfiguration.Fields
            .Select(it => it.DataTypeFieldId)
            .ToHashSet();

        var missingIds = dataTypeFields.Keys
            .Except(requestDataTypeFieldIds)
            .ToList();

        if (missingIds.Count > 0)
        {
            throw new ValidationException(
                $"Data type fields '{String.Join("', '", missingIds.Select(it => dataTypeFields[it].Name))}' are not present in the request."
            );
        }

        // Validate order
        var fieldOrders = request.ImportConfiguration.Fields
            .Select(it => it.Order)
            .ToHashSet();

        var missingOrders = Enumerable.Range(0, request.ImportConfiguration.Fields.Count)
            .Except(fieldOrders)
            .ToList();

        if (missingOrders.Count > 0)
        {
            throw new ValidationException(
                $"Data type fields orders '{String.Join("', '", missingOrders)}' are not present in the request."
            );
        }

        if (await _database.ImportConfigurations.AnyAsync(
                it => it.Name.Equals(
                    request.ImportConfiguration.Name,
                    StringComparison.OrdinalIgnoreCase
                )
            ))
        {
            throw new ValidationException("Import configuration with such name already exists.");
        }

        var configuration = (await _database.ImportConfigurations.AddAsync(
            new ImportConfiguration
            {
                DataTypeId = request.ImportConfiguration.DataTypeId,
                Id = request.ImportConfiguration.Id,
                Name = request.ImportConfiguration.Name,
                Fields = request.ImportConfiguration.Fields
                    .Select(
                        it => new ImportConfigurationField
                        {
                            DataTypeFieldId = it.DataTypeFieldId,
                            DefaultValue = it.DefaultValue is not null
                                ? _fieldTypeService.Serialize(dataTypeFields[it.DataTypeFieldId].Type, it.DefaultValue!.Value)
                                : null,
                            Id = it.Id ?? 0,
                            Order = it.Order
                        }
                    )
                    .ToList()
            }
        )).Entity;

        await _database.SaveChangesAsync();

        return configuration;
    }

    public async Task DeleteAsync(ImportConfigurationDeleteRequest request)
    {
        var configuration = await _database.ImportConfigurations
            .Include(it => it.DataType)
            .ThenInclude(it => it.Instance)
            .FirstOrDefaultAsync(it => it.Id == request.ImportConfigurationId);

        if (configuration is null)
        {
            throw new ValidationException("Import configuration was not found.");
        }

        if (!await _instanceAuthorizationService.IsMemberAsync(configuration.DataType.InstanceId, request.RequesterId))
        {
            throw new ValidationException("You are not authorized to delete import configurations.");
        }

        _database.Remove(configuration);

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(ImportConfigurationEditRequest request)
    {
        var configuration = await _database.ImportConfigurations
            .Include(it => it.DataType)
            .ThenInclude(it => it.Instance)
            .Include(it => it.DataType)
            .ThenInclude(it => it.Fields)
            .Include(it => it.Fields)
            .FirstOrDefaultAsync(it => it.Id == request.ImportConfiguration.Id);

        if (configuration is null)
        {
            throw new ValidationException("Import configuration was not found.");
        }

        if (!await _instanceAuthorizationService.IsMemberAsync(configuration.DataType.InstanceId, request.RequesterId))
        {
            throw new ValidationException("You are not authorized to edit import configurations.");
        }

        configuration.Name = request.ImportConfiguration.Name;

        // Validate fields
        var dataTypeFields = configuration.DataType.Fields.ToDictionary(it => it.Id, it => it);

        var requestDataTypeFieldIds = request.ImportConfiguration.Fields
            .Select(it => it.DataTypeFieldId)
            .ToHashSet();

        var missingIds = dataTypeFields.Keys
            .Except(requestDataTypeFieldIds)
            .ToList();

        if (missingIds.Count > 0)
        {
            throw new ValidationException(
                $"Data type fields '{String.Join("', '", missingIds.Select(it => dataTypeFields[it].Name))}' are not present in the request."
            );
        }

        // Validate order
        var fieldOrders = request.ImportConfiguration.Fields
            .Select(it => it.Order)
            .ToHashSet();

        var missingOrders = Enumerable.Range(0, request.ImportConfiguration.Fields.Count)
            .Except(fieldOrders)
            .ToList();

        if (missingOrders.Count > 0)
        {
            throw new ValidationException(
                $"Data type fields orders '{String.Join("', '", missingOrders)}' are not present in the request."
            );
        }

        // Only update fields, all of them must exist
        foreach (var field in request.ImportConfiguration.Fields)
        {
            var existingField = configuration.Fields.FirstOrDefault(it => it.DataTypeFieldId == field.DataTypeFieldId);

            if (existingField is null)
            {
                throw new ValidationException($"Data type field '{field.DataTypeFieldId}' was not found.");
            }

            existingField.DefaultValue = field.DefaultValue is not null
                ? _fieldTypeService.Serialize(dataTypeFields[field.DataTypeFieldId].Type, field.DefaultValue!.Value)
                : null;

            existingField.Order = field.Order;
        }

        await _database.SaveChangesAsync();
    }

    public async Task<ImportConfiguration> GetAsync(ImportConfigurationGetRequest request)
    {
        var configuration = await _database.ImportConfigurations
            .Include(it => it.Fields)
            .Include(it => it.DataType)
            .ThenInclude(it => it.Instance)
            .FirstOrDefaultAsync(it => it.Id == request.ImportConfigurationId);

        if (configuration is null)
        {
            throw new ValidationException("Import configuration was not found.");
        }

        if (!await _instanceAuthorizationService.IsMemberAsync(configuration.DataType.InstanceId, request.RequesterId))
        {
            throw new ValidationException("You are not authorized to get import configurations.");
        }

        return configuration;
    }

    public async Task<IList<ImportConfiguration>> GetAsync(ImportConfigurationGetBySomeIdRequest request)
    {
        var instance = await _database.Instances.FirstOrDefaultAsync(it => it.Id == request.InstanceId);
        var configurations = new List<ImportConfiguration>();

        if (instance is not null && !instance.IsDeleted)
        {
            if (!await _instanceAuthorizationService.IsMemberAsync(instance.Id, request.RequesterId))
            {
                throw new ValidationException("You are not authorized to get import configurations.");
            }

            configurations.AddRange(
                await _database.ImportConfigurations
                    .Include(it => it.Fields)
                    .Where(it => it.DataType.InstanceId == request.InstanceId)
                    .ToListAsync()
            );
        }

        var dataType = await _database.DataTypes
            .Include(it => it.Instance)
            .ThenInclude(it => it.Users)
            .FirstOrDefaultAsync(it => it.Id == request.DataTypeId);

        if (dataType is null || dataType.IsDeleted || dataType.Instance.IsDeleted)
        {
            return configurations;
        }

        if (!await _instanceAuthorizationService.IsMemberAsync(dataType.InstanceId, request.RequesterId))
        {
            throw new ValidationException("You are not authorized to get import configurations.");
        }

        configurations.AddRange(
            await _database.ImportConfigurations
                .Include(it => it.Fields)
                .Where(it => it.DataTypeId == request.DataTypeId)
                .ToListAsync()
        );

        return configurations;
    }
}