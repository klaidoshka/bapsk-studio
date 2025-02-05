using Microsoft.EntityFrameworkCore;

namespace Accounting.Services;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }
}