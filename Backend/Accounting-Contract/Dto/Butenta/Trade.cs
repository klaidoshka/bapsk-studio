using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Butenta;

public class Trade
{
    public DateTime Date { get; set; }
    public string Series { get; set; }
    public string OtherDoc { get; set; }
    public string ReceiverName { get; set; }
    public List<Item> Items { get; set; }
}

public static class TradeExtensions
{
    public static Entity.Sale ToEntityWithoutCustomer(this Trade trade)
    {
        return new Entity.Sale
        {
            CashRegisterNo = String.IsNullOrWhiteSpace(trade.Series) ? trade.OtherDoc : "",
            CashRegisterReceiptNo = "",
            Date = trade.Date,
            InvoiceNo = String.IsNullOrWhiteSpace(trade.Series)
                ? ""
                : trade.Series + trade.OtherDoc,
            Salesman = new Entity.Salesman
            {
                Name = trade.ReceiverName,
                VatPayerCode = "",
                VatPayerCodeIssuedBy = IsoCountryCode.LT
            },
            SoldGoods = trade.Items
                .Select((it, index) => it.ToEntity(index + 1))
                .ToList()
        };
    }
}