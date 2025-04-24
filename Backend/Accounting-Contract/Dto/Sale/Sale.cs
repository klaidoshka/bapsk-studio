using Accounting.Contract.Dto.Customer;
using Accounting.Contract.Dto.Salesman;

namespace Accounting.Contract.Dto.Sale;

public class Sale
{
    public CashRegister? CashRegister { get; set; }
    public Customer.Customer Customer { get; set; } = new();
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public int? Id { get; set; }
    public int? InstanceId { get; set; }
    public string? InvoiceNo { get; set; }
    public Salesman.Salesman Salesman { get; set; } = new();
    public IList<SoldGood> SoldGoods { get; set; } = new List<SoldGood>();
}

public static class SaleExtensions
{
    public static Sale ToDto(this Entity.Sale sale)
    {
        return new Sale
        {
            CashRegister = String.IsNullOrWhiteSpace(sale.InvoiceNo)
                ? new CashRegister
                {
                    CashRegisterNo = sale.CashRegisterNo ?? "",
                    ReceiptNo = sale.CashRegisterReceiptNo ?? ""
                }
                : null,
            Customer = sale.Customer.ToDto(),
            Date = sale.Date,
            Id = sale.Id,
            InstanceId = sale.InstanceId,
            InvoiceNo = sale.InvoiceNo,
            Salesman = sale.Salesman.ToDto(),
            SoldGoods = sale.SoldGoods
                .Select(it => it.ToDto())
                .ToList()
        };
    }

    public static SaleCreateEdit ToDtoCreateEdit(this Sale sale)
    {
        return new SaleCreateEdit
        {
            CashRegister = sale.CashRegister,
            CustomerId = sale.Customer.Id ?? 0,
            Date = sale.Date,
            Id = sale.Id ?? 0,
            InvoiceNo = sale.InvoiceNo,
            SalesmanId = sale.Salesman.Id ?? 0,
            SoldGoods = sale.SoldGoods
                .Select(it => it.ToDtoCreateEdit())
                .ToList()
        };
    }
}