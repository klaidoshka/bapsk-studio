namespace Accounting.Contract.Sti.Data.SubmitDeclaration;

public class SubmitDeclarationGoods
{
    public string SequenceNo { get; set; }
    public string Description { get; set; }
    public decimal Quantity { get; set; }
    public string Item { get; set; }
    public ItemChoice ItemElementName { get; set; }
    public decimal TaxableAmount { get; set; }
    public decimal VatRate { get; set; }
    public decimal VatAmount { get; set; }
    public decimal TotalAmount { get; set; }
}