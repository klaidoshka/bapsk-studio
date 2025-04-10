namespace Accounting.Contract.Dto.Sale;

public class SaleCreateEdit
{
    public CashRegister? CashRegister { get; set; }
    public int CustomerId { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public int? Id { get; set; }
    public string? InvoiceNo { get; set; }
    public int SalesmanId { get; set; }
    public IList<SoldGoodCreateEdit> SoldGoods { get; set; } = new List<SoldGoodCreateEdit>();
}