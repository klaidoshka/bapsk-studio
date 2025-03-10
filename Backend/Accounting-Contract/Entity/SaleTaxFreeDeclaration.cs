using System.ComponentModel.DataAnnotations;

namespace Accounting.Contract.Entity;

public class SaleTaxFreeDeclaration
{
    /// <summary>
    /// Correction number of the declaration. Should begin from 1.
    /// </summary>
    [Range(
        1,
        99,
        ErrorMessage = "Correction number must be between 1 and 99."
    )]
    public int Correction { get; set; } = 1;

    /// <summary>
    /// Unique identifier of the declaration.
    /// </summary>
    [StringLength(
        34,
        ErrorMessage = "Declaration document's id must be between 7 and 34 characters.",
        MinimumLength = 7
    )]
    [Key]
    public string Id { get; set; }
}