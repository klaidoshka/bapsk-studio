using Accounting.Contract.Dto.Sale;
using Sale = Accounting.Contract.Entity.Sale;

namespace Accounting.Contract.Service;

public interface ISaleService
{
    public Task<Sale> CreateAsync(SaleCreateRequest request);

    public Task DeleteAsync(SaleDeleteRequest request);

    public Task EditAsync(SaleEditRequest request);

    public Task<IList<Sale>> GetAsync(SaleGetRequest request);

    public Task<IList<Sale>> GetAsync(SaleWithinIntervalGetRequest request);

    public Task<Sale> GetByIdAsync(int id);
}