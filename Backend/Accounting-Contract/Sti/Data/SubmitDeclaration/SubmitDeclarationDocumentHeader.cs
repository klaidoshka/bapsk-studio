namespace Accounting.Contract.Sti.Data.SubmitDeclaration;

public class SubmitDeclarationDocumentHeader
{
    public SubmitDeclarationDocumentHeaderAffirmation Affirmation { get; set; }
    public DateTime CompletionDate { get; set; }
    public string DocumentCorrectionNo { get; set; }
    public string DocumentId { get; set; }
}