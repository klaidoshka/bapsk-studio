using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class StiVatReturnDeclarationQrCode
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Navigation property to the VAT return declaration.
    /// </summary>
    public StiVatReturnDeclaration Declaration { get; set; }

    /// <summary>
    /// Id of the VAT return declaration to which the QR code is associated.
    /// </summary>
    public string DeclarationId { get; set; }

    /// <summary>
    /// Value of the QR code in Base64 format.
    /// </summary>
    public string Value { get; set; }
}