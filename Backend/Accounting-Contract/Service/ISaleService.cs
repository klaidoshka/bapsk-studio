using Accounting.Contract.Dto.Sale;
using Sale = Accounting.Contract.Entity.Sale;

namespace Accounting.Contract.Service;

public interface ISaleService
{
    /// <summary>
    /// Creates new sale.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Created sale</returns>
    public Task<Sale> CreateAsync(SaleCreateRequest request);

    /// <summary>
    /// Deletes sale.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task DeleteAsync(SaleDeleteRequest request);

    /// <summary>
    /// Edits sale.
    /// </summary>
    /// <param name="request">Request to process</param>
    public Task EditAsync(SaleEditRequest request);

    /// <summary>
    /// Gets all accessible sales.
    /// </summary>
    /// <param name="request">Request to process</param>
    /// <returns>Sales that are accessible for identities provided in request</returns>
    public Task<IEnumerable<Sale>> GetAsync(SaleGetRequest request);
}