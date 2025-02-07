namespace Accounting.Contract.Sti.QueryDeclarations;

public enum QueryDeclarationsState
{
    /// <summary>
    /// Accepted, no errors
    /// </summary>
    ACCEPTED_CORRECT,

    /// <summary>
    /// Accepted, has errors.
    /// </summary>
    ACCEPTED_INCORRECT,

    /// <summary>
    /// Sti has customs assessment about this declaration's goods being
    /// (not)transported regarding tax refund.
    /// </summary>
    ASSESSED,

    /// <summary>
    /// Declaration was rejected.
    /// </summary>
    REJECTED,

    /// <summary>
    /// Declaration was cancelled.
    /// </summary>
    CANCELLED
}