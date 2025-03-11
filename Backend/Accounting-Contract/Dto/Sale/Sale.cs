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