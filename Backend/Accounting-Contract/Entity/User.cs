using Accounting.Contract.Enumeration;

namespace Accounting.Contract.Entity;

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
    /// Normalized (CAPITALIZED) email address of the user.
    /// </summary>
    public string EmailNormalized { get; set; }

    /// <summary>
    /// Unique identifier of the user.
    /// </summary>
    public Guid Id { get; set; }

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
}