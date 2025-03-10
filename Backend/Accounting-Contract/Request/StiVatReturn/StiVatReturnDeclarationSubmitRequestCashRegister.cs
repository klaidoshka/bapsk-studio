namespace Accounting.Contract.Request.StiVatReturn;

public class StiVatReturnDeclarationSubmitRequestCashRegister
{
    public string CashRegisterNo { get; set; } = String.Empty;
    public string ReceiptNo { get; set; } = String.Empty;
}