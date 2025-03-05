namespace Accounting.Contract.Dto.StiVatReturn.CancelDeclaration;

public class CancelDeclarationResponse
{
    /// <summary>
    ///     Errors that occurred during the operation. Only exists
    ///     if the operation's result is not successful.
    /// </summary>
    public IReadOnlyList<StiError> Errors { get; set; }

    /// <summary>
    ///     Response date-time, yyyy-MM-ddTHH:mm:ss.
    /// </summary>
    public required DateTime ResultDate { get; set; }

    /// <summary>
    ///     Result status of the operation, 8 characters.
    /// </summary>
    public required ResultStatus ResultStatus { get; set; }
}