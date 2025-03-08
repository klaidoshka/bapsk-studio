namespace Accounting.Contract.Dto.StiVatReturn.Butenta;

public class Item
{
    public int Code { get; set; }
    public string Article { get; set; }
    public int Quantity { get; set; }
    public string Unit { get; set; }
    public decimal Price { get; set; }
    public Vat Vat { get; set; }
    public decimal? Discount { get; set; }
    public string DiscMode { get; set; }
}