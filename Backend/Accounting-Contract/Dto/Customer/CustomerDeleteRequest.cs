namespace Accounting.Contract.Dto.Customer;

public class CustomerDeleteRequest
{
    public int CustomerId { get; set; }
    public int RequesterId { get; set; }
}