using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Salesman;
using Accounting.Contract.Validator;

namespace Accounting.Services.Validator;

public class SalesmanValidator : ISalesmanValidator
{
    public async Task<Validation> ValidateSalesmanAsync(Salesman salesman)
    {
        return new Validation();
    }

    public async Task<Validation> ValidateDeleteRequestAsync(int salesmanId)
    {
        return new Validation();
    }

    public async Task<Validation> ValidateEditRequestAsync(Salesman salesman)
    {
        return new Validation();
    }

    public async Task<Validation> ValidateGetByIdRequestAsync(int salesmanId)
    {
        return new Validation();
    }

    public async Task<Validation> ValidateGetRequestAsync(int instanceId)
    {
        return new Validation();
    }
}