namespace Accounting.Contract.Dto.Butenta;

public class Trade
{
    public DateTime Date { get; set; }
    public List<Item> Items { get; set; }
    public string OtherDoc { get; set; }
    public string ReceiverName { get; set; }
    public string Series { get; set; }
    public string SupplierName { get; set; }
}