namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclarationResponse
{
    public SubmitDeclarationState? DeclarationState { get; set; }
    public IList<StiError> Errors { get; set; }
    public required DateTime ResultDate { get; set; }
    public required ResultStatus ResultStatus { get; set; }
    public ulong? TransmissionId { get; set; }
}