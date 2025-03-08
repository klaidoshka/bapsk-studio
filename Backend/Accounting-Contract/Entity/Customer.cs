using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Accounting.Contract.Enumeration;

namespace Accounting.Contract.Dto.StiVatReturn;

public class Customer
{
    /// <summary>
    /// Birthdate of the customer
    /// </summary>
    public DateTime BirthDate { get; set; }

    /// <summary>
    /// First name of the customer
    /// </summary>
    public string FirstName { get; set; }

    /// <summary>
    /// Id of the customer
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Identity document number
    /// </summary>
    public string IdentityDocument { get; set; }

    /// <summary>
    /// Code of country that issued the identity document
    /// </summary>
    public IsoCountryCode IdentityDocumentIssuedBy { get; set; }

    /// <summary>
    /// Type of the identity document, either Passport or NationalId
    /// </summary>
    public IdentityDocumentType IdentityDocumentType { get; set; }

    /// <summary>
    /// Navigation property to the instance that the customer belongs to
    /// </summary>
    [ForeignKey(nameof(InstanceId))]
    public Instance Instance { get; set; }
    
    /// <summary>
    /// Instance id that the customer belongs to
    /// </summary>
    public int InstanceId { get; set; }

    /// <summary>
    /// Last name of the customer
    /// </summary>
    public string LastName { get; set; }
    
    /// <summary>
    /// Navigation property to the sales that the customer has made
    /// </summary>
    public virtual ICollection<Sale> Sales { get; set; }
}