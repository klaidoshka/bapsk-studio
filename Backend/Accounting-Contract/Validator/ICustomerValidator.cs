using Accounting.Contract.Dto;
using Accounting.Contract.Dto.Customer;

namespace Accounting.Contract.Validator;

public interface ICustomerValidator
{
    public Validation ValidateCustomer(Customer customer);

    public Task<Validation> ValidateDeleteRequestAsync(int customerId);

    public Task<Validation> ValidateEditRequestAsync(Customer customer);

    public Task<Validation> ValidateExistsAsync(int customerId);

    public Task<Validation> ValidateGetByIdRequestAsync(int customerId);

    public Task<Validation> ValidateGetRequestAsync(int instanceId);

    public Validation ValidateVatReturnCustomer(Customer customer);
}