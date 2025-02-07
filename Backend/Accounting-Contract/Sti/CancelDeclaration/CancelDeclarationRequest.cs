namespace Accounting.Contract.Sti.CancelDeclaration;

/// <summary>
/// Request to cancel a declaration of tax refund.
///
/// Cancels a declaration of provided DocumentId. All versions of the declaration
/// will be canceled, including the corrected ones.
///
/// New declaration will not be able to have the same DocumentId.
/// </summary>
public class CancelDeclarationRequest
{
    /// <summary>
    /// Unique declaration identifier, 34 characters.
    /// </summary>
    public required string DocumentId { get; set; }

    /// <summary>
    /// Unique identifier for the request, 36 characters.
    /// </summary>
    public required string RequestId { get; set; }

    /// <summary>
    /// Service consumer identification number. It may be
    /// seller or intermediary's identification number.
    ///
    /// 9 characters for individuals,
    /// 10 characters for Sti identification number,
    /// 10 characters for foreigner identification number,
    /// 6-8 characters for individuals of individual activity identification number
    /// </summary>
    public required string SenderId { get; set; }

    /// <summary>
    /// When the request was created, yyyy-MM-ddTHH:mm:ss.
    /// </summary>
    public required DateTime TimeStamp { get; set; }
}