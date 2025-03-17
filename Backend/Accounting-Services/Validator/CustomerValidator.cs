using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Customer;
using Accounting.Contract.Validator;

namespace Accounting.Services.Validator;

public class CustomerValidator : ICustomerValidator
{
    public async Task<Validation> ValidateCustomerAsync(Customer customer)
    {
        return new Validation();
    }

    public async Task<Validation> ValidateDeleteRequestAsync(int customerId)
    {
        return new Validation();
    }

    public async Task<Validation> ValidateEditRequestAsync(Customer customer)
    {
        return new Validation();
    }

    public async Task<Validation> ValidateGetByIdRequestAsync(int customerId)
    {
        return new Validation();
    }

    public async Task<Validation> ValidateGetRequestAsync(int instanceId)
    {
        return new Validation();
    }
}