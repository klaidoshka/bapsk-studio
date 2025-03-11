namespace Accounting.Contract.Dto.Salesman;

public class SalesmanEditRequest
{
    public int RequesterId { get; set; }
    public Salesman Salesman { get; set; }
}