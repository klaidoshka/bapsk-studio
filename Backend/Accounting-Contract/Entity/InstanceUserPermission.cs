using System.ComponentModel.DataAnnotations.Schema;

namespace Accounting.Contract.Entity;

public class InstanceUserPermission
{
    /// <summary>
    /// Navigation property to the instance user.
    /// </summary>
    [ForeignKey(nameof(InstanceUserId))]
    public InstanceUser InstanceUser { get; set; }
    
    /// <summary>
    /// Foreign key of the instance user.
    /// </summary>
    public int InstanceUserId { get; set; }
    
    /// <summary>
    /// Permission for the user within the instance.
    /// </summary>
    public string Permission { get; set; }
}