using Microsoft.EntityFrameworkCore;

namespace Accounting.Services;

public class AccountingDatabase : DbContext
{
    public AccountingDatabase(DbContextOptions<AccountingDatabase> options) : base(options) { }
}