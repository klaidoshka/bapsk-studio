namespace Accounting.Contract.Dto.Sti.VatReturn.Qr;

public class QrCodeSoldGood
{
    public int SequenceNo { get; set; }
    public string Description { get; set; } = null!;
    public decimal Quantity { get; set; }
    public decimal TotalAmount { get; set; }

    // Either UnitOfMeasureCode or UnitOfMeasureOther must be set
    public string? UnitOfMeasureCode { get; set; }
    public string? UnitOfMeasureOther { get; set; }
}