namespace Accounting.Contract.Sti.Data.CancelDeclaration;

public class CancelDeclarationRequest
{
    public string RequestId { get; set; }
    public DateTime TimeStamp { get; set; }
    public string SenderId { get; set; }
    public string DocumentId { get; set; }
}