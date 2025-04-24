using Accounting.Contract.Dto;
using Accounting.Contract.Dto.DataType;
using DataType = Accounting.Contract.Entity.DataType;

namespace Accounting.Contract.Validator;

public interface IDataTypeValidator : IInstanceEntityValidator<DataType>
{
    public Task<Validation> ValidateDataTypeCreateRequestAsync(DataTypeCreateRequest request);

    public Task<Validation> ValidateDataTypeEditRequestAsync(DataTypeEditRequest request);

    public Task<Validation> ValidateDataTypeFieldCreateRequestAsync(DataTypeFieldCreateRequest request);

    public Task<Validation> ValidateDataTypeFieldEditRequestAsync(DataTypeFieldEditRequest request);
}