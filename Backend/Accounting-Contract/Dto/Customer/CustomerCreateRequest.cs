namespace Accounting.Contract.Dto.Customer;

public class CustomerCreateRequest
{
    public Customer Customer { get; set; }
    public int InstanceId { get; set; }
}