using Accounting.Contract.Dto.Butenta;
using Accounting.Contract.Entity;

namespace Accounting.Contract.Service;

public interface IButentaService
{
    public Task<ICollection<Client>> GetClientsAsync();

    public Task<Trade?> GetTradeAsync(int tradeId);

    public Task<TradeWithClients?> GetTradeWithClientsAsync(int tradeId);

    public Task<StiVatReturnDeclaration?> GetVatReturnDeclarationByTradeId(int tradeId);
}