namespace Accounting.Contract.Sti.Data.SubmitDeclaration;

public class SubmitDeclarationResponse
{
    public SubmitDeclarationState? DeclarationState { get; set; }
    public IReadOnlyList<StiError> Errors { get; set; }
    public DateTime ResultDate { get; set; }
    public ResultStatus ResultStatus { get; set; }
    public ulong? TransmissionId { get; set; }
}