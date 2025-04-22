using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class InstanceUserPermission
{
    /// <summary>
    /// Navigation property to the instance user meta.
    /// </summary>
    [ForeignKey(nameof(InstanceUserMetaId))]
    public InstanceUserMeta InstanceUserMeta { get; set; }
    
    /// <summary>
    /// Foreign key of the instance user meta.
    /// </summary>
    public int InstanceUserMetaId { get; set; }
    
    /// <summary>
    /// Permission for the user within the instance.
    /// </summary>
    public string Permission { get; set; }
}