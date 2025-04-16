using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class StiVatReturnDeclarationPayment
{
    /// <summary>
    /// Paid VAT amount.
    /// </summary>
    public decimal Amount { get; set; }

    /// <summary>
    /// When the payment was made.
    /// </summary>
    public DateTime Date { get; set; }

    /// <summary>
    /// Navigation property to the declaration of the payment.
    /// </summary>
    [ForeignKey(nameof(DeclarationId))]
    public StiVatReturnDeclaration Declaration { get; set; }

    /// <summary>
    /// Foreign key to the declaration of the payment.
    /// </summary>
    public string DeclarationId { get; set; }

    /// <summary>
    /// Unique identifier of the payment.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Type of the payment.
    /// </summary>
    public PaymentType Type { get; set; }
}