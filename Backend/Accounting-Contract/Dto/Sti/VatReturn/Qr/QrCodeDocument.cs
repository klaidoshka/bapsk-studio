namespace Accounting.Contract.Dto.Sti.VatReturn.Qr;

public class QrCodeDocument
{
    public QrCodeDocumentHeader DocHeader { get; set; } = null!;
    public QrCodeCustomer Customer { get; set; } = null!;
    public IEnumerable<QrCodeSoldGood> Goods { get; set; } = new List<QrCodeSoldGood>();
}