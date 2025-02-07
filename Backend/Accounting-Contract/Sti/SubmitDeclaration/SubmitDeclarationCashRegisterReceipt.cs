namespace Accounting.Contract.Sti.SubmitDeclaration;

public class SubmitDeclarationCashRegisterReceipt
{
    /// <summary>
    /// Cash register number.
    /// </summary>
    public required string CashRegisterNo { get; set; }

    /// <summary>
    /// Cash register receipt number.
    /// </summary>
    public required string ReceiptNo { get; set; }
}