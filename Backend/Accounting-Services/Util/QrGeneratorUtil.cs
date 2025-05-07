using System.IO.Compression;
using System.Text;
using Accounting.Contract.Dto.Sti.VatReturn.Qr;
using ICSharpCode.SharpZipLib.Checksum;
using QRCoder;

namespace Accounting.Services.Util;

public static class QrGeneratorUtil
{
    private const int ChunkSize = 2048;

    // Calculates checksum of provided text with Adler32 algorithm
    private static string CalculateChecksum(string text)
    {
        var adler32 = new Adler32();

        adler32.Update(Encoding.UTF8.GetBytes(text));

        return adler32.Value.ToString("X8");
    }

    // Compresses text into byte array with GZip
    private static byte[] Compress(string text)
    {
        if (String.IsNullOrEmpty(text))
        {
            return [];
        }

        using var memoryStream = new MemoryStream();

        using (var gZipStream = new GZipStream(memoryStream, CompressionMode.Compress))
        using (var writer = new StreamWriter(gZipStream, Encoding.UTF8))
        {
            writer.Write(text);
        }

        return memoryStream.ToArray();
    }

    // Creates QR code envelope chunks split by 2KB size from provided JSON string
    public static List<QrCodeEnvelopeChunk> CreateQrCodeEnvelopeChunks(string json)
    {
        var compressed = Compress(json);
        var base64 = Convert.ToBase64String(compressed);
        var checksum = CalculateChecksum(base64);
        var total = (int)Math.Ceiling((double)base64.Length / ChunkSize);
        var envelopes = new List<QrCodeEnvelopeChunk>();

        for (var i = 0; i < total; i++)
        {
            var data = base64.Substring(
                i * ChunkSize,
                Math.Min(ChunkSize, base64.Length - i * ChunkSize)
            );

            envelopes.Add(
                new QrCodeEnvelopeChunk
                {
                    Data = data,
                    Chunk = i + 1,
                    Total = total,
                    Checksum = checksum
                }
            );
        }

        return envelopes;
    }

    // Generates QR code from provided text as a Base64 string
    public static string GenerateQrCode(string text)
    {
        using var generator = new QRCodeGenerator();
        using var data = generator.CreateQrCode(text, QRCodeGenerator.ECCLevel.M);
        using var code = new Base64QRCode(data);

        return code.GetGraphic(4);
    }
}