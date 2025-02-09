using Accounting.Contract;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Accounting.Contract.Service.Request;
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
        var instance = await _database.Instances
                           .Include(i => i.CreatedBy)
                           .FirstOrDefaultAsync(i => i.Id == request.InstanceId)
                       ?? throw new ArgumentException("Instance not found.");

        if (instance.CreatedBy.Id != request.CreatorId)
        {
            throw new ArgumentException("Creator does not have permission to create data types in this instance.");
        }

        var dataType = new DataType
        {
            Description = request.Description,
            InstanceId = request.InstanceId,
            Name = request.Name
        };

        await _database.DataTypes.AddAsync(dataType);

        await _database.SaveChangesAsync();

        return dataType;
    }

    public async Task DeleteAsync(int id)
    {
        var dataType = await _database.DataTypes
                           .Include(dt => dt.Fields)
                           .FirstOrDefaultAsync(dt => dt.Id == id)
                       ?? throw new ArgumentException("Data type not found.");

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
                           .FirstOrDefaultAsync(d => d.Id == request.Id)
                       ?? throw new ArgumentException("Data type not found.");

        if (dataType.Instance.CreatedById != request.ManagerId)
        {
            throw new ArgumentException("Manager does not have permission to edit this data type.");
        }

        dataType.Description = request.Description;
        dataType.Name = request.Name;

        await _database.SaveChangesAsync();
    }

    public async Task<DataType> GetAsync(int id)
    {
        return await _database.DataTypes.FirstOrDefaultAsync(dt => dt.Id == id)
               ?? throw new ArgumentException("Data type not found.");
    }

    public async Task<IEnumerable<DataType>> GetByInstanceIdAsync(int instanceId)
    {
        return await _database.DataTypes
            .Where(dt => dt.InstanceId == instanceId)
            .ToListAsync();
    }
}