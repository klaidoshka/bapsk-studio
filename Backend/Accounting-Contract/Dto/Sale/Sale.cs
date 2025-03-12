using Accounting.Contract.Dto.Customer;
using Accounting.Contract.Dto.Salesman;

namespace Accounting.Contract.Dto.Sale;

public class Sale
{
    public CashRegister? CashRegister { get; set; }
    public Customer.Customer Customer { get; set; } = new();
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public int? Id { get; set; }
    public string? InvoiceNo { get; set; }
    public Salesman.Salesman Salesman { get; set; } = new();
    public IEnumerable<SoldGood> SoldGoods { get; set; } = new List<SoldGood>();
}

public static class SaleExtensions
{
    public static Sale ToDto(this Entity.Sale sale)
    {
        return new Sale
        {
            CashRegister = sale.InvoiceNo == null
                ? new CashRegister
                {
                    CashRegisterNo = sale.CashRegisterNo ?? "",
                    ReceiptNo = sale.CashRegisterReceiptNo ?? ""
                }
                : null,
            Customer = sale.Customer.ToDto(),
            Date = sale.Date,
            Id = sale.Id,
            InvoiceNo = sale.InvoiceNo,
            Salesman = sale.Salesman.ToDto(),
            SoldGoods = sale.SoldGoods
                .Select(it => it.ToDto())
                .ToList()
        };
    }
}