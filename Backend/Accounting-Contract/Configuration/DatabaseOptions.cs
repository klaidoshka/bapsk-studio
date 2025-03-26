namespace Accounting.Contract.Configuration;

public class DatabaseOptions
{
    /// <summary>
    /// String to connect to the database.
    /// </summary>
    public string ConnectionString { get; set; }

    /// <summary>
    /// Dialect of the database.
    /// </summary>
    public string Dialect { get; set; }

    /// <summary>
    /// Server version of the database.
    /// </summary>
    public string ServerVersion { get; set; }
}