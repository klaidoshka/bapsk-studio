using Accounting.Contract.Service;
using ExcelDataReader;

namespace Accounting.Services.Service;

public class CsvService : ICsvService
{
    private static IExcelDataReader GetReader(Stream stream, string fileExtension)
    {
        return fileExtension.ToLowerInvariant() switch
        {
            ".csv" => ExcelReaderFactory.CreateCsvReader(stream),
            _ => ExcelReaderFactory.CreateReader(stream)
        };
    }

    public IList<string> GetSupportedFileExtensions()
    {
        return new List<string>
        {
            ".csv",
            ".xls",
            ".xlsb",
            ".xlsx"
        };
    }

    public bool IsSupportedFileExtension(string fileExtension)
    {
        return GetSupportedFileExtensions()
            .Any(
                it => it.Equals(
                    fileExtension,
                    StringComparison.InvariantCultureIgnoreCase
                )
            );
    }

    public string[][] ReadCsv(Stream stream, string fileExtension, bool skipHeader)
    {
        using var reader = GetReader(stream, fileExtension);
        var result = new List<string[]>();

        while (reader.Read())
        {
            if (skipHeader && reader.Depth == 0)
            {
                continue;
            }
            
            var row = new string[reader.FieldCount];

            for (var i = 0; i < reader.FieldCount; i++)
            {
                row[i] = reader.GetValue(i)?.ToString() ?? String.Empty;
            }

            result.Add(row);
        }

        return result.ToArray();
    }
}