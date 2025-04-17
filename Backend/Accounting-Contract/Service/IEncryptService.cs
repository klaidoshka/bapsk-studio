namespace Accounting.Contract.Service;

public interface IEncryptService
{
    public Task<string> DecryptAsync(string value, string secret);
    
    public Task<string> EncryptAsync(string value, string secret);
}