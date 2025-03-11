namespace Accounting.Contract.Dto.Customer;

public class CustomerEditRequest
{
    public Customer Customer { get; set; }
    public int RequesterId { get; set; }
}