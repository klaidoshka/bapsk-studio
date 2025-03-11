namespace Accounting.Contract.Dto.Sale;

public class SaleEditRequest
{
    public int RequesterId { get; set; }
    public SaleCreateEdit Sale { get; set; }
}