namespace Accounting.Contract.Dto.StiVatReturn;

// InvoiceNo or CashRegisterReceiptNo and CashRegisterNo must be provided
public class Sale
{
    public Customer Customer { get; set; }

    public string? CashRegisterNo { get; set; }

    public string? CashRegisterReceiptNo { get; set; }

    public int Id { get; set; }

    public string? InvoiceNo { get; set; }

    public Salesman Salesman { get; set; }

    public DateTime SalesDate { get; set; }
}