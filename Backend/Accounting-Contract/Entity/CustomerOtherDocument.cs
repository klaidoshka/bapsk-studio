using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class CustomerOtherDocument
{
    /// <summary>
    /// Navigation property to the customer that the document belongs to
    /// </summary>
    [ForeignKey(nameof(CustomerId))]
    public Customer Customer { get; set; }
    
    /// <summary>
    /// Id of the customer that the document belongs to
    /// </summary>
    public int CustomerId { get; set; }
    
    /// <summary>
    /// Id of the document
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    /// <summary>
    /// Country code that issued the document
    /// </summary>
    public IsoCountryCode IssuedBy { get; set; }

    /// <summary>
    /// Type of the document that can identify that the customer are who they say they are and
    /// live in the country they say they live in
    /// </summary>
    public string Type { get; set; } = String.Empty;

    /// <summary>
    /// Value of the document
    /// </summary>
    public string Value { get; set; } = String.Empty;
}