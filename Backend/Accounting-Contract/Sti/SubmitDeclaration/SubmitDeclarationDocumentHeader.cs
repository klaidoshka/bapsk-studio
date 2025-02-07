namespace Accounting.Contract.Sti.SubmitDeclaration;

public class SubmitDeclarationDocumentHeader
{
    /// <summary>
    /// Affirmation that this buyer can use TaxFree service.
    /// </summary>
    public required SubmitDeclarationDocumentHeaderAffirmation Affirmation { get; set; }

    /// <summary>
    /// The same or earlier than the date (TimeStamp) of the submit request.
    /// </summary>
    public required DateTime CompletionDate { get; set; }

    /// <summary>
    /// Declaration correction number.
    /// </summary>
    public required string DocumentCorrectionNo { get; set; }

    /// <summary>
    /// Declaration unique identifier.
    /// </summary>
    public required string DocumentId { get; set; }
}