namespace Accounting.Contract.Dto.Sti.VatReturn.CancelDeclaration;

public class CancelDeclarationResponse
{
    public IList<StiError>? Errors { get; set; }
    public required DateTime ResultDate { get; set; }
    public required ResultStatus ResultStatus { get; set; }
}