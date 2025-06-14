using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Contract.Entity;

[Index(nameof(SaleId), IsUnique = true)]
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
    /// Navigation property to Export entity.
    /// May not exist, if the declaration's goods are not yet assessed for export.
    /// </summary>
    public StiVatReturnDeclarationExport? Export { get; set; }

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
    /// Marks the declaration as canceled.
    /// </summary>
    public bool IsCancelled { get; set; }
    
    /// <summary>
    /// Navigation property for the VAT return payments of this declaration.
    /// </summary>
    public ICollection<StiVatReturnDeclarationPayment> Payments { get; set; } = new List<StiVatReturnDeclarationPayment>();

    /// <summary>
    /// Navigation property for the QR codes of this declaration.
    /// </summary>
    public ICollection<StiVatReturnDeclarationQrCode> QrCodes { get; set; } = new List<StiVatReturnDeclarationQrCode>();

    /// <summary>
    /// Navigation property for the sale of the declaration.
    /// </summary>
    [ForeignKey(nameof(SaleId))]
    public Sale Sale { get; set; }

    /// <summary>
    /// Sale identifier of the declaration.
    /// </summary>
    public int SaleId { get; set; }

    /// <summary>
    /// Status of the declaration.
    /// </summary>
    public SubmitDeclarationState State { get; set; }

    /// <summary>
    /// Date of last declaration submission.
    /// </summary>
    public DateTime SubmitDate { get; set; }
}