using Accounting.Contract.Dto.DataType;
using DataType = Accounting.Contract.Entity.DataType;

namespace Accounting.Contract.Service;

public interface IDataTypeService
{
    public Task<DataType> CreateAsync(DataTypeCreateRequest request);

    public Task DeleteAsync(DataTypeDeleteRequest request);

    public Task EditAsync(DataTypeEditRequest request);

    public Task<DataType> GetAsync(DataTypeGetRequest request);

    public Task<IEnumerable<DataType>> GetByInstanceIdAsync(DataTypeGetByInstanceRequest request);
}