using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Accounting.Contract.Dto.StiVatReturn.SubmitDeclaration;

namespace Accounting.Contract.Entity;

public class StiVatReturnDeclaration
{
    /// <summary>
    /// Correction number of the declaration. Should begin from 1.
    /// </summary>
    [Range(
        1,
        99,
        ErrorMessage = "Correction number must be between 1 and 99."
    )]
    public int Correction { get; set; }

    /// <summary>
    /// Navigation property for the user who declared the declaration.
    /// </summary>
    [ForeignKey(nameof(DeclaredById))]
    public User? DeclaredBy { get; set; }

    /// <summary>
    /// Identifier of who declared the declaration. Only null if declared by the system from
    /// external requests.
    /// </summary>
    public int? DeclaredById { get; set; }

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

    /// <summary>
    /// Navigation property for the instance of the declaration.
    /// </summary>
    [ForeignKey(nameof(InstanceId))]
    public Instance? Instance { get; set; }

    /// <summary>
    /// Instance identifier of the declaration. This defines the instance this declaration belongs to.
    /// Only null if declared by the system from external requests.
    /// </summary>
    public int? InstanceId { get; set; }

    /// <summary>
    /// Navigation property for the sale of the declaration.
    /// </summary>
    [ForeignKey(nameof(SaleId))]
    public Sale? Sale { get; set; }

    /// <summary>
    /// Sale identifier of the declaration. Only null if declared by the system from external requests.
    /// </summary>
    public int? SaleId { get; set; }

    /// <summary>
    /// Status of the declaration.
    /// </summary>
    public SubmitDeclarationState? State { get; set; }

    /// <summary>
    /// Date of last declaration submission.
    /// </summary>
    public DateTime SubmitDate { get; set; }
}