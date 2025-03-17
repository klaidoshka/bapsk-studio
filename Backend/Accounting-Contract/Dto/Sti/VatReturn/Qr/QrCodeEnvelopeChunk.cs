namespace Accounting.Contract.Dto.Sti.VatReturn.Qr;

public class QrCodeEnvelopeChunk
{
    public string Checksum { get; set; } = null!;
    public int Chunk { get; set; }
    public string Data { get; set; } = null!;
    public int Total { get; set; }
}