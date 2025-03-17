using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Sale;
using Accounting.Contract.Validator;

namespace Accounting.Services.Validator;

public class SaleValidator : ISaleValidator
{
    public async Task<Validation> ValidateSaleAsync(SaleCreateEdit sale)
    {
        return new Validation();
    }

    public async Task<Validation> ValidateDeleteRequestAsync(int saleId)
    {
        return new Validation();
    }

    public async Task<Validation> ValidateEditRequestAsync(SaleCreateEdit sale)
    {
        return new Validation();
    }

    public async Task<Validation> ValidateGetByIdRequestAsync(int saleId)
    {
        return new Validation();
    }

    public async Task<Validation> ValidateGetRequestAsync(int instanceId)
    {
        return new Validation();
    }
}