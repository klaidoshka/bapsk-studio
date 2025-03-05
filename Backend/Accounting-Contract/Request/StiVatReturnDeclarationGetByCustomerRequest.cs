namespace Accounting.Contract.Request;

public class StiVatReturnDeclarationGetByCustomerRequest
{
    public int CustomerId { get; set; }
    public int InstanceId { get; set; }
    public int RequesterId { get; set; }
}