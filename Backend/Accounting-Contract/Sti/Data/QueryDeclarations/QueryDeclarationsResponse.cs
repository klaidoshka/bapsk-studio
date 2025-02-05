namespace Accounting.Contract.Sti.Data.QueryDeclarations;

public class QueryDeclarationsResponse
{
    /// <summary>
    /// Declarations that match the query. Will exist if the operation was
    /// successful.
    /// </summary>
    public required IReadOnlyList<QueryDeclarationsDeclaration>? Declarations { get; set; }

    /// <summary>
    /// Errors that occurred during the operation. Only exists if the operation's
    /// result is not successful.
    /// </summary>
    public required IReadOnlyList<StiError>? Errors { get; set; }

    /// <summary>
    /// Response date-time, yyyy-MM-ddTHH:mm:ss.
    /// </summary>
    public required DateTime ResultDate { get; set; }

    /// <summary>
    /// Result status of the operation, 8 characters.
    /// </summary>
    public required ResultStatus ResultStatus { get; set; }
}