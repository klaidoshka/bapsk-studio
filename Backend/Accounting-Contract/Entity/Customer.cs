using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class Customer
{
    /// <summary>
    /// Birthdate of the customer
    /// </summary>
    public DateTime Birthdate { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Email of the customer
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// First name of the customer.
    /// </summary>
    public string FirstName { get; set; } = String.Empty;

    /// <summary>
    /// Id of the customer
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Code of country that issued the identity document
    /// </summary>
    public IsoCountryCode IdentityDocumentIssuedBy { get; set; } = IsoCountryCode.LT;

    /// <summary>
    /// Identity document number
    /// </summary>
    public string IdentityDocumentNumber { get; set; } = String.Empty;

    /// <summary>
    /// Type of the identity document, either Passport or NationalId
    /// </summary>
    public IdentityDocumentType IdentityDocumentType { get; set; } = IdentityDocumentType.Passport;

    /// <summary>
    /// Identity document value, meaning person's personal code
    /// </summary>
    public string? IdentityDocumentValue { get; set; }

    /// <summary>
    /// Navigation property to the instance that the customer belongs to
    /// </summary>
    [ForeignKey(nameof(InstanceId))]
    public Instance? Instance { get; set; }

    /// <summary>
    /// Instance id that the customer belongs to
    /// </summary>
    public int? InstanceId { get; set; }

    /// <summary>
    /// Marks if the customer is deleted
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    /// Last name of the customer
    /// </summary>
    public string LastName { get; set; } = String.Empty;

    /// <summary>
    /// Navigation property to the other documents that the customer has associated.
    /// These documents help to identify the customer and prove that they live in the country they say they live in.
    /// </summary>
    public ICollection<CustomerOtherDocument> OtherDocuments { get; set; } = new List<CustomerOtherDocument>();

    /// <summary>
    /// Country code of the country that the customer resides in
    /// </summary>
    public IsoCountryCode ResidenceCountry { get; set; }

    /// <summary>
    /// Navigation property to the sales that the customer has made
    /// </summary>
    public ICollection<Sale> Sales { get; set; } = new List<Sale>();
}