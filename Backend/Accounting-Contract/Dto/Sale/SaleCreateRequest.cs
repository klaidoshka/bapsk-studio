namespace Accounting.Contract.Dto.Sale;

public class SaleCreateRequest
{
    public int InstanceId { get; set; }
    public int RequesterId { get; set; }
    public SaleCreateEdit Sale { get; set; }
}