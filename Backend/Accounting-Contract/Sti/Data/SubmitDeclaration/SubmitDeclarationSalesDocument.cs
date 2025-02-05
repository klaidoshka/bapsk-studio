namespace Accounting.Contract.Sti.Data.SubmitDeclaration;

public class SubmitDeclarationSalesDocument
{
    /// <summary>
    /// Cash register receipt information. Either this or InvoiceNo should be provided.
    /// </summary>
    public required SubmitDeclarationCashRegisterReceipt? CashRegisterReceipt { get; set; }

    /// <summary>
    /// Items sequence of this sale.
    /// </summary>
    public required IReadOnlyList<SubmitDeclarationGoods> Goods { get; set; }

    /// <summary>
    /// VAT invoice sequence and/or number. Either this or CashRegisterReceipt should be provided.
    /// </summary>
    public required string? InvoiceNo { get; set; }

    /// <summary>
    /// Sale date-time, yyyy-MM-ddTHH:mm:ss.
    /// </summary>
    public required DateTime SalesDate { get; set; }
}