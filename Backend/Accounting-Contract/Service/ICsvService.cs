namespace Accounting.Contract.Service;

public interface ICsvService
{
    public IList<string> GetSupportedFileExtensions();
    
    public bool IsSupportedFileExtension(string fileExtension);
    
    public string[][] ReadCsv(Stream stream, string fileExtension, bool skipHeader = false);
}