using Accounting.Contract.Configuration;
using Accounting.Contract.Entity;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Contract;

public class AccountingDatabase : DbContext
{
    private readonly DatabaseOptions _databaseOptions;

    public DbSet<Session> Sessions { get; set; }
    public DbSet<User> Users { get; set; }

    public AccountingDatabase(DbContextOptions<AccountingDatabase> options, DatabaseOptions databaseOptions) : base(options)
    {
        _databaseOptions = databaseOptions;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);

        ServerVersion version = _databaseOptions.Dialect.ToLowerInvariant() switch
        {
            "mariadb" => new MariaDbServerVersion(_databaseOptions.ServerVersion),
            "mysql"   => new MySqlServerVersion(_databaseOptions.ServerVersion),
            _         => throw new NotSupportedException($"Dialect {_databaseOptions.Dialect} is not supported.")
        };

        optionsBuilder.UseMySql(_databaseOptions.ConnectionString, version);
    }
}