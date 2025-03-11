namespace Accounting.Contract.Dto.Customer;

public class CustomerGetRequest
{
    public int? InstanceId { get; set; }
    public int RequesterId { get; set; }
}