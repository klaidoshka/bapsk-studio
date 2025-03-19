using Accounting.Contract.Dto.Salesman;
using Salesman = Accounting.Contract.Entity.Salesman;

namespace Accounting.Contract.Service;

public interface ISalesmanService
{
    public Task<Salesman> CreateAsync(SalesmanCreateRequest request);
    
    public Task DeleteAsync(SalesmanDeleteRequest request);
    
    public Task EditAsync(SalesmanEditRequest request);
    
    public Task<IEnumerable<Salesman>> GetAsync(SalesmanGetRequest request);
    
    public Task<Salesman> GetByIdAsync(int id);
}