using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Butenta;

public class TradeWithClients : Trade
{
    public Client Receiver { get; set; }
    public Client Supplier { get; set; }
}

public static class TradeWithClientsExtensions
{
    public static Entity.Sale ToEntity(this TradeWithClients trade, IsoCountryCode customerCountry, IsoCountryCode salesmanCountry)
    {
        return new Entity.Sale
        {
            CashRegisterNo = String.IsNullOrWhiteSpace(trade.Series) ? trade.OtherDoc : "",
            CashRegisterReceiptNo = "",
            Customer = trade.Receiver.ToCustomerEntity(customerCountry),
            Date = trade.Date,
            InvoiceNo = String.IsNullOrWhiteSpace(trade.Series)
                ? ""
                : trade.Series + trade.OtherDoc,
            Salesman = trade.Supplier.ToSalesmanEntity(salesmanCountry),
            SoldGoods = trade.Items
                .Select((it, index) => it.ToEntity(index + 1))
                .ToList()
        };
    }
}