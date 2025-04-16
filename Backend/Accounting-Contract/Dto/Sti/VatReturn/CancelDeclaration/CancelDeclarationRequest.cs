namespace Accounting.Contract.Dto.Sti.VatReturn.CancelDeclaration;

public class CancelDeclarationRequest
{
    public required string DocumentId { get; set; }
    public required string RequestId { get; set; }
    public required string SenderId { get; set; }
    public required DateTime TimeStamp { get; set; }
}