namespace Accounting.Contract.Sti.QueryDeclarations;

public class QueryDeclarationsQuery
{
    /// <summary>
    /// State of the declaration, 20 characters.
    /// If ACCESSED is specified, returns only declarations that have
    /// been accessed about the state of goods being transported.
    /// </summary>
    public QueryDeclarationsState? DeclarationState { get; set; }

    /// <summary>
    /// Unique declaration identifier, 34 characters.
    /// If this identifier is provided, other parameters are ignored.
    /// </summary>
    public string? DocumentId { get; set; }

    /// <summary>
    /// Date range from which the declaration was created.
    /// </summary>
    public DateTime? StateDateFrom { get; set; }

    /// <summary>
    /// Date range to which the declaration was created.
    /// </summary>
    public DateTime? StateDateTo { get; set; }
}