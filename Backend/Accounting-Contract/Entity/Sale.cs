using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

// InvoiceNo or CashRegisterReceiptNo and CashRegisterNo must be provided
public class Sale
{
    /// <summary>
    /// Sale cash register's number
    /// </summary>
    public string? CashRegisterNo { get; set; }

    /// <summary>
    /// Sale cash register's receipt number
    /// </summary>
    public string? CashRegisterReceiptNo { get; set; }

    /// <summary>
    /// Navigation property to the customer that is associated with this sale
    /// </summary>
    [ForeignKey(nameof(CustomerId))]
    public Customer Customer { get; set; }

    /// <summary>
    /// Customer id associated with this sale
    /// </summary>
    public int CustomerId { get; set; }

    /// <summary>
    /// Date of this sale occurrence
    /// </summary>
    public DateTime Date { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Id of the sale
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Navigation property to the instance that the sale belongs to
    /// </summary>
    [ForeignKey(nameof(InstanceId))]
    public Instance? Instance { get; set; }

    /// <summary>
    /// Instance id that the sale belongs to
    /// </summary>
    public int? InstanceId { get; set; }

    /// <summary>
    /// Sale invoice number. Either this or CashRegisterReceiptNo AND CashRegisterNo (both of them)
    /// must be provided.
    /// </summary>
    public string? InvoiceNo { get; set; }
    
    /// <summary>
    /// Marks if this sale is deleted
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    /// Navigation property to the salesman that is associated with this sale
    /// </summary>
    [ForeignKey(nameof(SalesmanId))]
    public Salesman Salesman { get; set; }

    /// <summary>
    /// Salesman id associated with this sale
    /// </summary>
    public int SalesmanId { get; set; }
    
    /// <summary>
    /// Navigation property to the goods that were sold in this sale
    /// </summary>
    public virtual ICollection<SoldGood> SoldGoods { get; set; } = new List<SoldGood>();
}