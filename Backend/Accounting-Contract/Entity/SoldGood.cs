using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class SoldGood
{
    /// <summary>
    /// Description of the good. What is it?
    /// </summary>
    public string Description { get; set; }

    /// <summary>
    /// Id of the sold gGood.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    /// <summary>
    /// Marks if this sold good is deleted
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    /// Quantity of the sold good.
    /// </summary>
    public decimal Quantity { get; set; }

    /// <summary>
    /// Navigation property to the sale that the good was sold in.
    /// </summary>
    [ForeignKey(nameof(SaleId))]
    public Sale Sale { get; set; }
    
    /// <summary>
    /// Sale id that the good was sold in.
    /// </summary>
    public int SaleId { get; set; }

    /// <summary>
    /// Sequence number of the sold good.
    /// </summary>
    public int SequenceNo { get; set; }

    /// <summary>
    /// Total price of the sold good, excluding VAT.
    /// This equals to: Quantity * UnitPrice
    /// </summary>
    public decimal TaxableAmount { get; set; }

    /// <summary>
    /// Total price of the sold good, including VAT.
    /// This equals to: Quantity * UnitPrice + VatAmount
    /// </summary>
    public decimal TotalAmount { get; set; }

    /// <summary>
    /// Measurement unit of the sold good.
    /// </summary>
    public string UnitOfMeasure { get; set; }

    /// <summary>
    /// Type of the measurement unit of the sold good.
    /// Whether it uses a standard code or custom description.
    /// </summary>
    public UnitOfMeasureType UnitOfMeasureType { get; set; }

    /// <summary>
    /// VAT amount of the sold good.
    /// This equals to: Quantity * UnitPrice * VatRate
    /// </summary>
    public decimal VatAmount { get; set; }

    /// <summary>
    /// VAT rate of the sold good. Between 0 and 1.
    /// </summary>
    public decimal VatRate { get; set; }
}