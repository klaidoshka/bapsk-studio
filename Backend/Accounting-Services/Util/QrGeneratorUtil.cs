using System.IO.Compression;
using System.Text;
using Accounting.Contract.Dto.Sti.VatReturn.Qr;
using ICSharpCode.SharpZipLib.Checksum;
using QRCoder;

namespace Accounting.Services.Util;

public static class QrGeneratorUtil
{
    private const int ChunkSize = 2048;

    /// <summary>
    /// Calculates checksum of provided text with Adler32 algorithm
    /// </summary>
    /// <param name="text">Text to calculate checksum for</param>
    /// <returns>Calculated checksum of text value in HEX format of at least 8 digits</returns>
    private static string CalculateChecksum(string text)
    {
        var adler32 = new Adler32();

        adler32.Update(Encoding.UTF8.GetBytes(text));

        return adler32.Value.ToString("X8");
    }

    /// <summary>
    /// Strips line-endings and tabs from text
    /// </summary>
    /// <param name="text">Text to strip of formats</param>
    /// <returns>Text without new line endings or tab characters</returns>
    public static string CleanUpBeforeGenerating(string text)
    {
        return text
            .ReplaceLineEndings(String.Empty)
            .Replace("\t", String.Empty);
    }

    /// <summary>
    /// Compresses text into byte array with GZip
    /// </summary>
    /// <param name="text">Text to compress</param>
    /// <returns>Compressed text in byte[] form</returns>
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

    /// <summary>
    /// Creates QR code envelope chunks from provided JSON
    /// </summary>
    /// <param name="json">Json to use for QR code chunks creation</param>
    /// <returns>List of QR code chunks, split by 2KB size</returns>
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

    /// <summary>
    /// Generates QR code from provided text as a Base64 string
    /// </summary>
    /// <param name="text">Text to generate QR code for</param>
    /// <returns>Base64 string that resolves into QR code image</returns>
    public static string GenerateQrCode(string text)
    {
        using var generator = new QRCodeGenerator();
        using var data = generator.CreateQrCode(text, QRCodeGenerator.ECCLevel.M);
        using var code = new Base64QRCode(data);

        return code.GetGraphic(20);
    }
}