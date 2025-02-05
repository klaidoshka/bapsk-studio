namespace Accounting.Contract.Sti.Data.CancelDeclaration;

public class CancelDeclarationResponse
{
    public ResultStatus ResultStatus { get; set; }
    public DateTime ResultDate { get; set; }
    public IReadOnlyList<StiError> Errors { get; set; }
}