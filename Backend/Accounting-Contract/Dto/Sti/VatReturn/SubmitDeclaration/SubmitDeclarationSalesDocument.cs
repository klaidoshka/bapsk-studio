namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclarationSalesDocument
{
    public required SubmitDeclarationCashRegisterReceipt? CashRegisterReceipt { get; set; }
    public required IList<SubmitDeclarationGoods> Goods { get; set; }
    public required string? InvoiceNo { get; set; }
    public required DateTime SalesDate { get; set; }
}