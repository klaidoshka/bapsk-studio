namespace Accounting.Contract.Request.StiVatReturn;

public class StiVatReturnDeclarationSubmitRequestSale
{
    public StiVatReturnDeclarationSubmitRequestCashRegister? CashRegister { get; set; }
    public StiVatReturnDeclarationSubmitRequestCustomer Customer { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public int? Id { get; set; }
    public int? InstanceId { get; set; }
    public string? InvoiceNo { get; set; }
    public StiVatReturnDeclarationSubmitRequestSalesman Salesman { get; set; } = new();

    public IEnumerable<StiVatReturnDeclarationSubmitRequestSoldGood> SoldGoods { get; set; } =
        new List<StiVatReturnDeclarationSubmitRequestSoldGood>();
}