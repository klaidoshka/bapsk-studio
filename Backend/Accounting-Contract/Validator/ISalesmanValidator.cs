using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Salesman;

namespace Accounting.Contract.Validator;

public interface ISalesmanValidator
{
    public Validation ValidateSalesman(Salesman salesman);

    public Task<Validation> ValidateDeleteRequestAsync(int salesmanId);

    public Task<Validation> ValidateEditRequestAsync(Salesman salesman);

    public Task<Validation> ValidateExistsAsync(int salesmanId);

    public Task<Validation> ValidateGetByIdRequestAsync(int salesmanId);

    public Task<Validation> ValidateGetRequestAsync(int instanceId);

    public Validation ValidateVatReturnSalesman(Salesman salesman);
}