using Accounting.Contract.Dto.Salesman;
using Salesman = Accounting.Contract.Entity.Salesman;

namespace Accounting.Contract.Service;

public interface ISalesmanService
{
    /// <summary>
    /// Creates new salesman.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Created salesman</returns>
    public Task<Salesman> CreateAsync(SalesmanCreateRequest request);
    
    /// <summary>
    /// Deletes salesman.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task DeleteAsync(SalesmanDeleteRequest request);
    
    /// <summary>
    /// Edits salesman.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task EditAsync(SalesmanEditRequest request);
    
    /// <summary>
    /// Gets all accessible salesmen.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Salesmen that are accessible for identities provided in request</returns>
    public Task<IEnumerable<Salesman>> GetAsync(SalesmanGetRequest request);
    
    /// <summary>
    /// Gets single salesman by id.
    /// </summary>
    /// <param name="id">Id of the salesman</param>
    /// <returns>Salesman</returns>
    public Task<Salesman> GetByIdAsync(int id);
}