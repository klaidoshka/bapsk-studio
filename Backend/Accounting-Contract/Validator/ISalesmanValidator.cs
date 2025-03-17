using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Salesman;

namespace Accounting.Contract.Validator;

public interface ISalesmanValidator
{
    public Task<Validation> ValidateSalesmanAsync(Salesman salesman);

    public Task<Validation> ValidateDeleteRequestAsync(int salesmanId);

    public Task<Validation> ValidateEditRequestAsync(Salesman salesman);

    public Task<Validation> ValidateGetByIdRequestAsync(int salesmanId);

    public Task<Validation> ValidateGetRequestAsync(int instanceId);
}