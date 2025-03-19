using Accounting.Contract.Dto.Customer;
using Customer = Accounting.Contract.Entity.Customer;

namespace Accounting.Contract.Service;

public interface ICustomerService
{
    public Task<Customer> CreateAsync(CustomerCreateRequest request);

    public Task DeleteAsync(CustomerDeleteRequest request);

    public Task EditAsync(CustomerEditRequest request);

    public Task<IEnumerable<Customer>> GetAsync(CustomerGetRequest request);

    public Task<Customer> GetByIdAsync(int id);
}