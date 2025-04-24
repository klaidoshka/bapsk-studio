using Accounting.Contract.Dto;
using Accounting.Contract.Entity;

namespace Accounting.Contract.Validator;

public interface ICustomerValidator : IInstanceEntityValidator<Customer>
{
    public Validation ValidateCustomer(Dto.Customer.Customer customer);

    public Task<Validation> ValidateDeleteRequestAsync(int customerId);

    public Task<Validation> ValidateEditRequestAsync(Dto.Customer.Customer customer);

    public Task<Validation> ValidateExistsAsync(int customerId);

    public Task<Validation> ValidateGetByIdRequestAsync(int customerId);

    public Task<Validation> ValidateGetRequestAsync(int instanceId);

    public Validation ValidateVatReturnCustomer(Dto.Customer.Customer customer);
}