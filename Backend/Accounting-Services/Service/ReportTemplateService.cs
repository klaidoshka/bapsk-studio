using Accounting.Contract;
using Accounting.Contract.Dto;
using Accounting.Contract.Dto.ReportTemplate;
using Accounting.Contract.Service;
using Microsoft.EntityFrameworkCore;
using ReportTemplate = Accounting.Contract.Entity.ReportTemplate;

namespace Accounting.Services.Service;

public class ReportTemplateService : IReportTemplateService
{
    private readonly AccountingDatabase _database;
    private readonly IInstanceAuthorizationService _instanceAuthorizationService;

    public ReportTemplateService(
        AccountingDatabase database,
        IInstanceAuthorizationService instanceAuthorizationService
    )
    {
        _database = database;
        _instanceAuthorizationService = instanceAuthorizationService;
    }

    public async Task<ReportTemplate> CreateAsync(ReportTemplateCreateRequest request)
    {
        // Should throw if request contains fields that are deleted

        if (!request.ReportTemplate.Fields.Any())
        {
            throw new ValidationException("At least one field is required.");
        }

        var dataTypeFields = await _database.DataTypeFields
            .Include(it => it.DataType)
            .Where(it => !it.DataType.IsDeleted && request.ReportTemplate.Fields.Contains(it.Id))
            .ToListAsync();

        var dataTypeFieldsByInstanceId = dataTypeFields
            .GroupBy(it => it.DataType.InstanceId)
            .ToDictionary(it => it.Key, it => it.ToList());

        if (dataTypeFieldsByInstanceId.Count != 1)
        {
            throw new ValidationException("All fields must be from the same instance.");
        }

        if (await _database.ReportTemplates.AnyAsync(it =>
                it.Fields.First().DataType.InstanceId == dataTypeFieldsByInstanceId.First().Key &&
                String.Equals(
                    it.Name,
                    request.ReportTemplate.Name,
                    StringComparison.OrdinalIgnoreCase
                )
            ))
        {
            throw new ValidationException("A report template with the same name already exists.");
        }

        var template = (await _database.ReportTemplates.AddAsync(
            new ReportTemplate
            {
                CreatedById = request.RequesterId,
                Fields = dataTypeFields,
                Name = request.ReportTemplate.Name
            }
        )).Entity;

        await _database.SaveChangesAsync();

        return template;
    }

    public async Task DeleteAsync(ReportTemplateDeleteRequest request)
    {
        var template = await _database.ReportTemplates
            .Include(it => it.Fields)
            .ThenInclude(it => it.DataType)
            .AsSplitQuery()
            .FirstAsync(it => it.Id == request.ReportTemplateId);

        template.IsDeleted = true;

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(ReportTemplateEditRequest request)
    {
        var template = await _database.ReportTemplates
            .Include(it => it.Fields)
            .ThenInclude(it => it.DataType)
            .AsSplitQuery()
            .FirstAsync(it => it.Id == request.ReportTemplate.Id);

        if (await _database.ReportTemplates.AnyAsync(it =>
                it.Fields.First().DataType.InstanceId == template.Fields.First().DataType.InstanceId &&
                String.Equals(
                    it.Name,
                    request.ReportTemplate.Name,
                    StringComparison.OrdinalIgnoreCase
                )
            ))
        {
            throw new ValidationException("A report template with the same name already exists.");
        }

        template.Name = request.ReportTemplate.Name;

        var fields = await _database.DataTypeFields
            .Include(it => it.DataType)
            .Where(it => !it.DataType.IsDeleted && request.ReportTemplate.Fields.Contains(it.Id))
            .ToListAsync();

        var dataTypeFieldsByInstanceId = fields.ToDictionary(it => it.DataType.InstanceId);

        if (dataTypeFieldsByInstanceId.Count != 1)
        {
            throw new ValidationException("All fields must be from the same instance.");
        }

        template.Fields = fields;

        await _database.SaveChangesAsync();
    }

    public async Task<ReportTemplate> GetAsync(ReportTemplateGetRequest request)
    {
        return await _database.ReportTemplates
            .Include(it => it.Fields)
            .ThenInclude(it => it.DataType)
            .AsSplitQuery()
            .FirstAsync(it => it.Id == request.ReportTemplateId);
    }

    public async Task<int> GetInstanceIdAsync(int templateId)
    {
        return (await _database.ReportTemplates.Include(rt => rt.Fields)
                .ThenInclude(f => f.DataType)
                .FirstAsync(rt => rt.Id == templateId)).Fields
            .First()
            .DataType.InstanceId;
    }

    public async Task<IList<ReportTemplate>> GetAsync(ReportTemplateGetByInstanceIdRequest request)
    {
        return await _database.ReportTemplates
            .Include(it => it.Fields)
            .ThenInclude(it => it.DataType)
            .AsSplitQuery()
            .Where(it => !it.IsDeleted && it.Fields.Any(field => field.DataType.InstanceId == request.InstanceId))
            .ToListAsync();
    }
}