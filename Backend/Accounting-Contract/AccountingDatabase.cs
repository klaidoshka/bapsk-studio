using Accounting.Contract.Entity;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Contract;

public class AccountingDatabase : DbContext
{
    public DbSet<Session> Sessions { get; set; }
    public DbSet<User> Users { get; set; }

    public AccountingDatabase(DbContextOptions<AccountingDatabase> options) : base(options) { }
}