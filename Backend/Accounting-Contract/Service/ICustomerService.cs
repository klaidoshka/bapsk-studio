using Accounting.Contract.Dto.Customer;
using Customer = Accounting.Contract.Entity.Customer;

namespace Accounting.Contract.Service;

public interface ICustomerService
{
    /// <summary>
    /// Creates new customer.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Created customer</returns>
    public Task<Customer> CreateAsync(CustomerCreateRequest request);

    /// <summary>
    /// Deletes customer.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task DeleteAsync(CustomerDeleteRequest request);

    /// <summary>
    /// Edits customer.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task EditAsync(CustomerEditRequest request);

    /// <summary>
    /// Gets all accessible customers.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Customers that are accessible for identities provided in request</returns>
    public Task<IEnumerable<Customer>> GetAsync(CustomerGetRequest request);

    /// <summary>
    /// Gets single customer by id.
    /// </summary>
    /// <param name="id">Id of the customer</param>
    /// <returns>Customer</returns>
    public Task<Customer> GetByIdAsync(int id);
}