namespace Accounting.Contract.Dto.Salesman;

public class SalesmanCreateRequest
{
    public int InstanceId { get; set; }
    public int RequesterId { get; set; }
    public Salesman Salesman { get; set; }
}