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

        if (!await _instanceAuthorizationService.IsMemberAsync(
                dataTypeFieldsByInstanceId.First().Key,
                request.RequesterId
            )
           )
        {
            throw new ValidationException("You are not authorized to create a report template.");
        }

        if (await _database.ReportTemplates.AnyAsync(it => String.Equals(
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
            .FirstOrDefaultAsync(it => it.Id == request.ReportTemplateId);

        if (template is null || template.IsDeleted)
        {
            throw new ValidationException("Report template was not found.");
        }

        if (!await _instanceAuthorizationService.IsMemberAsync(
                template.Fields.First().DataType.InstanceId,
                request.RequesterId
            )
           )
        {
            throw new ValidationException("You are not authorized to delete this report template.");
        }

        template.IsDeleted = true;

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(ReportTemplateEditRequest request)
    {
        // Should throw if request contains fields that are deleted

        var template = await _database.ReportTemplates
            .Include(it => it.Fields)
            .ThenInclude(it => it.DataType)
            .AsSplitQuery()
            .FirstOrDefaultAsync(it => it.Id == request.ReportTemplate.Id);

        if (template is null || template.IsDeleted)
        {
            throw new ValidationException("Report template was not found.");
        }

        if (!await _instanceAuthorizationService.IsMemberAsync(
                template.Fields.First().DataType.InstanceId,
                request.RequesterId
            )
           )
        {
            throw new ValidationException("You are not authorized to edit this report template.");
        }

        if (await _database.ReportTemplates.AnyAsync(it => String.Equals(
                    it.Name,
                    request.ReportTemplate.Name,
                    StringComparison.OrdinalIgnoreCase
                )
            ))
        {
            throw new ValidationException("A report template with the same name already exists.");
        }

        template.Name = request.ReportTemplate.Name;

        template.Fields = await _database.DataTypeFields
            .Include(it => it.DataType)
            .Where(it => !it.DataType.IsDeleted && request.ReportTemplate.Fields.Contains(it.Id))
            .ToListAsync();

        await _database.SaveChangesAsync();
    }

    public async Task<ReportTemplate> GetAsync(ReportTemplateGetRequest request)
    {
        var template = await _database.ReportTemplates
            .Include(it => it.Fields)
            .ThenInclude(it => it.DataType)
            .AsSplitQuery()
            .FirstOrDefaultAsync(it => it.Id == request.ReportTemplateId);

        if (template is null || template.IsDeleted)
        {
            throw new ValidationException("Report template was not found.");
        }

        if (!await _instanceAuthorizationService.IsMemberAsync(
                template.Fields.First().DataType.InstanceId,
                request.RequesterId
            )
           )
        {
            throw new ValidationException("You are not authorized to get this report template.");
        }

        return template;
    }

    public async Task<int> GetInstanceIdAsync(int templateId)
    {
        return (await _database.ReportTemplates.Include(rt => rt.Fields)
                .ThenInclude(f => f.DataType)
                .FirstAsync(rt => rt.Id == templateId)).Fields
            .First().DataType.InstanceId;
    }

    public async Task<IList<ReportTemplate>> GetAsync(ReportTemplateGetByInstanceIdRequest request)
    {
        if (!await _instanceAuthorizationService.IsMemberAsync(
                request.InstanceId,
                request.RequesterId
            ))
        {
            throw new ValidationException("You are not authorized to get these report templates.");
        }

        return await _database.ReportTemplates
            .Include(it => it.Fields)
            .ThenInclude(it => it.DataType)
            .AsSplitQuery()
            .Where(it => !it.IsDeleted && it.Fields.Any(field => field.DataType.InstanceId == request.InstanceId))
            .ToListAsync();
    }
}