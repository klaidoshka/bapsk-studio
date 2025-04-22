using Accounting.Contract.Dto;
using Accounting.Contract.Entity;

namespace Accounting.Contract.Validator;

public interface ISalesmanValidator : IInstanceEntityValidator<Salesman>
{
    public Validation ValidateSalesman(Dto.Salesman.Salesman salesman);

    public Task<Validation> ValidateDeleteRequestAsync(int salesmanId);

    public Task<Validation> ValidateEditRequestAsync(Dto.Salesman.Salesman salesman);

    public Task<Validation> ValidateExistsAsync(int salesmanId);

    public Task<Validation> ValidateGetByIdRequestAsync(int salesmanId);

    public Task<Validation> ValidateGetRequestAsync(int instanceId);

    public Validation ValidateVatReturnSalesman(Dto.Salesman.Salesman salesman);
}