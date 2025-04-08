using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Contract.Entity;

[Index(nameof(EmailNormalized), IsUnique = true)]
public class User
{
    /// <summary>
    /// Birthdate of the user.
    /// </summary>
    public DateTime BirthDate { get; set; } = DateTime.MinValue;

    /// <summary>
    /// Country of the user.
    /// </summary>
    public IsoCountryCode Country { get; set; } = IsoCountryCode.LT;

    /// <summary>
    /// Email address of the user.
    /// </summary>
    public string Email { get; set; } = String.Empty;

    /// <summary>
    /// Normalized (LOWERED) email address of the user.
    /// </summary>
    public string EmailNormalized { get; set; } = String.Empty;

    /// <summary>
    /// Unique identifier of the user.
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    /// <summary>
    /// Role of the user.
    /// </summary>
    public Role Role { get; set; } = Role.User;

    /// <summary>
    /// Marks the user as deleted.
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    /// First name of the user.
    /// </summary>
    public string FirstName { get; set; } = String.Empty;

    /// <summary>
    /// Navigation property to instances that the user has created for accounting.
    /// </summary>
    public ICollection<Instance> InstancesCreated { get; set; } = new List<Instance>();

    /// <summary>
    /// Navigation property to instances user metas associated with the user.
    /// These metas define which instances the user has access to.
    /// </summary>
    public ICollection<InstanceUserMeta> InstanceUserMetas { get; set; } = new List<InstanceUserMeta>();

    /// <summary>
    /// Last name of the user.
    /// </summary>
    public string LastName { get; set; } = String.Empty;

    /// <summary>
    /// Password hash of the user.
    /// </summary>
    public string PasswordHash { get; set; } = String.Empty;

    /// <summary>
    /// Navigation property for the sessions created by the user.
    /// </summary>
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
}