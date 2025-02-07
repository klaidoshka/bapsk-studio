namespace Accounting.Contract.Sti.QueryDeclarations;

public class QueryDeclarationsDeclaration
{
    /// <summary>
    /// Last customs requested declaration's correction. It may mismatch
    /// the last accepted declaration's correction number, if customs were
    /// using older correction version, 5 characters.
    /// </summary>
    public string DocumentCorrectionNoCustoms { get; set; }

    /// <summary>
    /// Last accepted declaration's correction number, 5 characters.
    /// </summary>
    public required string DocumentCorrectionNoLast { get; set; }

    /// <summary>
    /// Unique identifier of the declaration, 34 characters.
    /// </summary>
    public required string DocumentId { get; set; }

    /// <summary>
    /// State of the declaration.
    /// </summary>
    public required QueryDeclarationsState DeclarationState { get; set; }

    /// <summary>
    /// Date of the current state being set onto the declaration.
    /// </summary>
    public required DateTime StateDate { get; set; }
}