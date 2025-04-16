using Accounting.Contract.Entity;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Contract;

public class AccountingDatabase : DbContext
{
    public DbSet<ButentaTrade> ButentaTrades { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<CustomerOtherDocument> CustomerOtherDocuments { get; set; }
    public DbSet<DataEntry> DataEntries { get; set; }
    public DbSet<DataEntryField> DataEntryFields { get; set; }
    public DbSet<DataType> DataTypes { get; set; }
    public DbSet<DataTypeField> DataTypeFields { get; set; }
    public DbSet<ImportConfiguration> ImportConfigurations { get; set; }
    public DbSet<ImportConfigurationField> ImportConfigurationFields { get; set; }
    public DbSet<Instance> Instances { get; set; }
    public DbSet<InstanceUserMeta> InstanceUserMetas { get; set; }
    public DbSet<Sale> Sales { get; set; }
    public DbSet<Salesman> Salesmen { get; set; }
    public DbSet<Session> Sessions { get; set; }
    public DbSet<SoldGood> SoldGoods { get; set; }
    public DbSet<StiVatReturnDeclaration> StiVatReturnDeclarations { get; set; }
    public DbSet<StiVatReturnDeclarationPayment> StiVatReturnDeclarationPayments { get; set; }
    public DbSet<StiVatReturnDeclarationExport> StiVatReturnDeclarationExports { get; set; }
    public DbSet<StiVatReturnDeclarationExportAssessmentCondition> StiVatReturnDeclarationExportAssessmentConditions { get; set; }
    public DbSet<StiVatReturnDeclarationExportVerifiedGood> StiVatReturnDeclarationExportVerifiedGoods { get; set; }
    public DbSet<StiVatReturnDeclarationQrCode> StiVatReturnDeclarationQrCodes { get; set; }
    public DbSet<User> Users { get; set; }

    public AccountingDatabase(DbContextOptions<AccountingDatabase> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<DataType>()
            .HasMany(d => d.Fields)
            .WithOne(f => f.DataType)
            .HasForeignKey(f => f.DataTypeId);

        modelBuilder.Entity<DataTypeField>()
            .HasOne(f => f.Reference)
            .WithMany()
            .HasForeignKey(f => f.ReferenceId);
    }
}