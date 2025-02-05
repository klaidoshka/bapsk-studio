using Accounting.Services.Entity;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Services;

public class AccountingDatabase : DbContext
{
    public DbSet<Session> Sessions { get; set; }
    public DbSet<User> Users { get; set; }

    public AccountingDatabase(DbContextOptions<AccountingDatabase> options) : base(options) { }
}