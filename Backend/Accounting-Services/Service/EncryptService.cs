using System.Security.Cryptography;
using System.Text;
using Accounting.Contract.Service;

namespace Accounting.Services.Service;

public class EncryptService : IEncryptService
{
    public async Task<string> DecryptAsync(string value, string secret)
    {
        using var aes = Aes.Create();
        
        aes.Key = SHA256.HashData(Encoding.UTF8.GetBytes(secret));
        
        var cipher = Convert.FromBase64String(value);
        var iv = new byte[aes.BlockSize / 8];
        
        Array.Copy(cipher, iv, iv.Length);
        
        aes.IV = iv;

        using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
        using var memoryStream = new MemoryStream(cipher, iv.Length, cipher.Length - iv.Length);
        await using var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
        using var reader = new StreamReader(cryptoStream);

        return await reader.ReadToEndAsync();
    }

    public async Task<string> EncryptAsync(string value, string secret)
    {
        using var aes = Aes.Create();
        
        aes.Key = SHA256.HashData(Encoding.UTF8.GetBytes(secret));
        
        aes.GenerateIV();

        using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
        using var memoryStream = new MemoryStream();
        
        memoryStream.Write(aes.IV, 0, aes.IV.Length);

        await using var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write);
        await using var writer = new StreamWriter(cryptoStream);

        await writer.WriteAsync(value);
        await writer.FlushAsync();
        await cryptoStream.FlushFinalBlockAsync();

        return Convert.ToBase64String(memoryStream.ToArray());
    }
}