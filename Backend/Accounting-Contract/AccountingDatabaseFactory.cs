using Accounting.Contract.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Accounting.Contract;

public class AccountingDatabaseFactory : IDesignTimeDbContextFactory<AccountingDatabase>
{
    public AccountingDatabase CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AccountingDatabase>();

        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")
            ?.ToLowerInvariant();

        var isDevelopmentEnvironment = environment is null or "development";

        var configurationFileName = isDevelopmentEnvironment
            ? "appsettings.Development.json"
            : "appsettings.json";

        var configuration = new ConfigurationBuilder()
            .AddJsonFile(
                Directory.GetCurrentDirectory() + $@"\..\Accounting-API\{configurationFileName}"
            )
            .Build();

        var databaseOptions = configuration.GetSection(nameof(DatabaseOptions));
        var connectionString = databaseOptions[nameof(DatabaseOptions.ConnectionString)];

        if (String.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidDataException("Connection string is missing");
        }

        var dialect = databaseOptions[nameof(DatabaseOptions.Dialect)];
        var serverVersion = databaseOptions[nameof(DatabaseOptions.ServerVersion)];

        ServerVersion version = dialect?.ToLowerInvariant() switch
        {
            "mariadb" => new MariaDbServerVersion(serverVersion),
            "mysql" => new MySqlServerVersion(serverVersion),
            _ => throw new NotSupportedException("Database dialect not supported.")
        };

        optionsBuilder.UseMySql(
            connectionString,
            version,
            mySqlOptionsBuilder => mySqlOptionsBuilder.EnableStringComparisonTranslations()
        );

        return new AccountingDatabase(optionsBuilder.Options);
    }
}