using Accounting.Contract;
using Accounting.Contract.Entity;
using Accounting.Contract.Request;
using Accounting.Contract.Response;
using Accounting.Contract.Service;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class DataTypeService : IDataTypeService
{
    private readonly AccountingDatabase _database;

    public DataTypeService(AccountingDatabase database)
    {
        _database = database;
    }

    public async Task<DataType> CreateAsync(DataTypeCreateRequest request)
    {
        if (!await _database.Instances.AnyAsync(i => i.Id == request.InstanceId))
        {
            throw new ValidationException("Instance not found.");
        }

        var dataType = (await _database.DataTypes.AddAsync(
            new DataType
            {
                Description = request.Description,
                InstanceId = request.InstanceId,
                Name = request.Name
            }
        )).Entity;

        await _database.SaveChangesAsync();

        return dataType;
    }

    public async Task DeleteAsync(int id, int managerId)
    {
        var dataType = await _database.DataTypes
                           .Include(dt => dt.Fields)
                           .Include(dt => dt.Instance)
                           .FirstOrDefaultAsync(dt => dt.Id == id)
                       ?? throw new ValidationException("Data type not found.");

        if (dataType.IsDeleted == true)
        {
            return;
        }

        dataType.IsDeleted = true;

        await _database.SaveChangesAsync();
    }

    public async Task EditAsync(DataTypeEditRequest request)
    {
        var dataType = await _database.DataTypes
                           .Include(d => d.Instance)
                           .FirstOrDefaultAsync(d => d.Id == request.Id);

        if (dataType == null || dataType.IsDeleted == true)
        {
            throw new ValidationException("Data type not found.");
        }

        dataType.Description = request.Description;
        dataType.Name = request.Name;

        await _database.SaveChangesAsync();
    }

    public async Task<DataType> GetAsync(int id)
    {
        var dataType = await _database.DataTypes.FirstOrDefaultAsync(dt => dt.Id == id);

        if (dataType == null || dataType.IsDeleted == true)
        {
            throw new ValidationException("Data type not found.");
        }

        return dataType;
    }

    public async Task<IEnumerable<DataType>> GetByInstanceIdAsync(int instanceId)
    {
        return await _database.DataTypes
            .Where(
                dt =>
                    dt.InstanceId == instanceId &&
                    dt.IsDeleted != true
            )
            .ToListAsync();
    }
}