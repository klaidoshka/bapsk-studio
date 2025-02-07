using Accounting.Contract.Entity;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Contract;

public class AccountingDatabase : DbContext
{
    public DbSet<DataEntry> DataEntries { get; set; }
    public DbSet<DataEntryField> DataEntryFields { get; set; }
    public DbSet<DataType> DataTypes { get; set; }
    public DbSet<DataTypeField> DataTypeFields { get; set; }
    public DbSet<Instance> Instances { get; set; }
    public DbSet<InstanceUserMeta> InstanceUserMetas { get; set; }
    public DbSet<SaleTaxFreeDeclaration> SaleTaxFreeDeclarations { get; set; }
    public DbSet<Session> Sessions { get; set; }
    public DbSet<User> Users { get; set; }

    public AccountingDatabase(DbContextOptions<AccountingDatabase> options) : base(options) { }
}