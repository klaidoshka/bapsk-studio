using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Accounting.Contract.Entity;

[PrimaryKey(nameof(Id))]
[Index(nameof(DocumentId), IsUnique = true)]
public class StiDeclarationByApi
{
    /// <summary>
    /// Correction number of the declaration. Should begin from 1.
    /// </summary>
    [Range(1, 99, ErrorMessage = "Correction number must be between 1 and 99.")]
    public int Correction { get; set; }

    /// <summary>
    /// Unique identifier of the declaration's document.
    /// </summary>
    public string DocumentId { get; set; }

    /// <summary>
    /// Unique identifier of the declaration.
    /// </summary>
    public Guid Id { get; set; }
}