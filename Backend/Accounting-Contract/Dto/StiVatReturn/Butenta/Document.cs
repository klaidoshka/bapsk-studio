namespace Accounting.Contract.Dto.StiVatReturn.Butenta;

public class Document
{
    public DateTime Date { get; set; }
    public string Series { get; set; }
    public string OtherDoc { get; set; }
    public string ReceiverName { get; set; }
    public List<Item> Items { get; set; }
}