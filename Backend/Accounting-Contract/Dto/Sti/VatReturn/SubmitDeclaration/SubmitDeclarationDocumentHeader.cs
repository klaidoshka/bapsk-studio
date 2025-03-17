namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclarationDocumentHeader
{
    /// <summary>
    ///     Affirmation that this buyer can use TaxFree service.
    /// </summary>
    public required SubmitDeclarationDocumentHeaderAffirmation Affirmation { get; set; }

    /// <summary>
    ///     When was the declaration document filled.
    ///     The same or earlier than the date (TimeStamp) of the submit request.
    /// </summary>
    public required DateTime CompletionDate { get; set; }

    /// <summary>
    ///     Declaration correction number. Starts from 1.
    /// </summary>
    public required int DocumentCorrectionNo { get; set; }

    /// <summary>
    ///     Declaration unique identifier, 34 characters.
    /// </summary>
    public required string DocumentId { get; set; }
}