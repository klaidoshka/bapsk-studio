using System.Net.Http.Json;
using Accounting.Contract;
using Accounting.Contract.Dto.Butenta;
using Accounting.Contract.Entity;
using Accounting.Contract.Service;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services.Service;

public class ButentaService : IButentaService
{
    private readonly AccountingDatabase _database;

    public ButentaService(AccountingDatabase database)
    {
        _database = database;
    }

    public async Task<ICollection<Client>> GetClientsAsync()
    {
        using var httpClient = new HttpClient();
        var clientsResponse = await httpClient.GetFromJsonAsync<ClientsResponse>($"http://0.0.0.0/api/v1/clients");

        return clientsResponse is null ? [] : clientsResponse.Clients;
    }

    public async Task<Trade?> GetTradeAsync(int tradeId)
    {
        using var httpClient = new HttpClient();
        var tradesResponse = await httpClient.GetFromJsonAsync<TradesResponse>($"http://0.0.0.0/api/v1/trade/{tradeId}");

        return tradesResponse?.Documents.ElementAtOrDefault(0);
    }

    public async Task<TradeWithClients?> GetTradeWithClientsAsync(int tradeId)
    {
        var trade = await GetTradeAsync(tradeId);

        if (trade is null)
        {
            return null;
        }

        var clients = await GetClientsAsync();
        var customer = clients.FirstOrDefault(client => client.Name == trade.ReceiverName);
        var salesman = clients.FirstOrDefault(client => client.Name == trade.SupplierName);

        if (customer is null || salesman is null)
        {
            return null;
        }

        return new TradeWithClients
        {
            Date = trade.Date,
            Items = trade.Items,
            OtherDoc = trade.OtherDoc,
            Receiver = customer,
            ReceiverName = customer.Name,
            Series = trade.Series,
            Supplier = salesman,
            SupplierName = salesman.Name
        };
    }

    public async Task<StiVatReturnDeclaration?> GetVatReturnDeclarationByTradeId(int tradeId)
    {
        return await _database.ButentaTrades
            .Include(it => it.Declaration)
            .ThenInclude(it => it.Sale)
            .ThenInclude(it => it.Salesman)
            .Include(it => it.Declaration)
            .ThenInclude(it => it.Sale)
            .ThenInclude(it => it.SoldGoods)
            .Include(it => it.Declaration)
            .ThenInclude(it => it.Sale)
            .ThenInclude(it => it.Customer)
            .Include(it => it.Declaration)
            .ThenInclude(it => it.Sale)
            .ThenInclude(it => it.Customer)
            .ThenInclude(it => it.OtherDocuments)
            .Include(it => it.Declaration)
            .ThenInclude(it => it.QrCodes)
            .Where(it => it.Id == tradeId)
            .Select(it => it.Declaration)
            .FirstOrDefaultAsync();
    }
}
