namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclarationDocumentHeader
{
    public required SubmitDeclarationDocumentHeaderAffirmation Affirmation { get; set; }
    public required DateTime CompletionDate { get; set; }
    public required int DocumentCorrectionNo { get; set; }
    public required string DocumentId { get; set; }
}