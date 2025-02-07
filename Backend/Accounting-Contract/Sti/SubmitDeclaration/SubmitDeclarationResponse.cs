namespace Accounting.Contract.Sti.SubmitDeclaration;

public class SubmitDeclarationResponse
{
    /// <summary>
    /// Declaration's state if the operation was successful, 20 characters.
    /// </summary>
    public SubmitDeclarationState? DeclarationState { get; set; }

    /// <summary>
    /// Errors that occurred during the operation. Only exists
    /// if the operation's result is not successful or partially
    /// successful.
    /// </summary>
    public IReadOnlyList<StiError> Errors { get; set; }

    /// <summary>
    /// Response date-time, yyyy-MM-ddTHH:mm:ss.
    /// </summary>
    public required DateTime ResultDate { get; set; }

    /// <summary>
    /// Result status of the operation, 8 characters.
    /// </summary>
    public required ResultStatus ResultStatus { get; set; }

    /// <summary>
    /// Identifier of the transmission to Sti, 19 digits. Only exists
    /// when the operation is successful.
    /// </summary>
    public ulong? TransmissionId { get; set; }
}