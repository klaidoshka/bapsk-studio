namespace Accounting.Contract.Sti.Data.SubmitDeclaration;

public class SubmitDeclarationRequest
{
    public SubmitDeclaration Declaration { get; set; }
    public string RequestId { get; set; }
    public DateTime TimeStamp { get; set; }
    public string SenderId { get; set; }
    public int Situation { get; set; }
}