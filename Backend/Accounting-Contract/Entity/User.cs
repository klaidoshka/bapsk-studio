using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Accounting.Contract.Enumeration;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Contract.Entity;

[Index(nameof(EmailNormalized), IsUnique = true)]
public class User
{
    /// <summary>
    /// Birthdate of the user.
    /// </summary>
    public DateTime BirthDate { get; set; }

    /// <summary>
    /// Country of the user.
    /// </summary>
    public IsoCountryCode Country { get; set; }

    /// <summary>
    /// Email address of the user.
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// Normalized (LOWERED) email address of the user.
    /// </summary>
    public string EmailNormalized { get; set; }

    /// <summary>
    /// Unique identifier of the user.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Marks the user as deleted.
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    /// First name of the user.
    /// </summary>
    public string FirstName { get; set; }

    /// <summary>
    /// Navigational property to instances that the user has created for accounting.
    /// </summary>
    public virtual ICollection<Instance> InstancesCreated { get; set; }

    /// <summary>
    /// Navigational property to instances user metas associated with the user.
    /// These metas define which instances the user has access to.
    /// </summary>
    public virtual ICollection<InstanceUserMeta> InstanceUserMetas { get; set; }

    /// <summary>
    /// Last name of the user.
    /// </summary>
    public string LastName { get; set; }

    /// <summary>
    /// Password hash of the user.
    /// </summary>
    public string PasswordHash { get; set; }

    /// <summary>
    /// Navigation property for the sessions created by the user.
    /// </summary>
    public virtual ICollection<Session> Sessions { get; set; }
}