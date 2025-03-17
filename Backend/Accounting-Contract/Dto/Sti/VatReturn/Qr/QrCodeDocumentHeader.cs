namespace Accounting.Contract.Dto.Sti.VatReturn.Qr;

public class QrCodeDocumentHeader
{
    public DateTime CompletionDate { get; set; }
    public int DocCorrNo { get; set; }
    public string DocId { get; set; } = null!;
}