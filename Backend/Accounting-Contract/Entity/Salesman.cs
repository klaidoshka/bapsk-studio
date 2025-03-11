using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class Salesman
{
    /// <summary>
    /// Id of the salesman
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Navigation property to the instance that the salesman belongs to
    /// </summary>
    [ForeignKey(nameof(InstanceId))]
    public Instance? Instance { get; set; }

    /// <summary>
    /// Instance id that the salesman belongs to
    /// </summary>
    public int? InstanceId { get; set; }
    
    /// <summary>
    /// Marks if the salesman is deleted
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    /// Name of the salesman
    /// </summary>
    public string Name { get; set; } = String.Empty;
    
    /// <summary>
    /// Navigation property to the sales that the salesman has made
    /// </summary>
    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();

    /// <summary>
    /// VAT payer code of the salesman
    /// </summary>
    public string VatPayerCode { get; set; } = String.Empty;

    /// <summary>
    /// Which country issued the VAT payer code of the salesman
    /// </summary>
    public IsoCountryCode VatPayerCodeIssuedBy { get; set; } = IsoCountryCode.LT;
}