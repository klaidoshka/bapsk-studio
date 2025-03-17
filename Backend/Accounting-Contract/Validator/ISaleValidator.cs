using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Sale;

namespace Accounting.Contract.Validator;

public interface ISaleValidator
{
    public Task<Validation> ValidateSaleAsync(SaleCreateEdit sale);
    public Task<Validation> ValidateDeleteRequestAsync(int saleId);
    public Task<Validation> ValidateEditRequestAsync(SaleCreateEdit sale);
    public Task<Validation> ValidateGetByIdRequestAsync(int saleId);
    public Task<Validation> ValidateGetRequestAsync(int instanceId);
    
}