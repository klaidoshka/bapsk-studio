namespace Accounting.Contract.Sti.Data.SubmitDeclaration;

public class SubmitDeclarationSalesDocument
{
    public SubmitDeclarationCashRegisterReceipt? CashRegisterReceipt { get; set; }
    public IReadOnlyList<SubmitDeclarationGoods> Goods { get; set; }
    public string? InvoiceNo { get; set; }
    public DateTime SalesDate { get; set; }
}