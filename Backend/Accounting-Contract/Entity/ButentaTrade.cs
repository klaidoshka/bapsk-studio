using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class ButentaTrade
{
    /// <summary>
    /// Navigation property for the declaration that this trade belongs to.
    /// </summary>
    [ForeignKey(nameof(DeclarationId))]
    public StiVatReturnDeclaration Declaration { get; set; }

    /// <summary>
    /// ID of the declaration that this trade belongs to.
    /// </summary>
    public string DeclarationId { get; set; }

    /// <summary>
    /// Manually assigned ID of the trade.
    /// </summary>
    [Key]
    public int Id { get; set; }
}