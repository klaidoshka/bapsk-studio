namespace Accounting.Contract.Dto.Sale;

public class SaleWithinIntervalGetRequest
{
    public int CustomerId { get; set; }
    public DateTime From { get; set; }
    public int SalesmanId { get; set; }
    public DateTime To { get; set; }
}