using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Butenta;

public class Item
{
    public string Article { get; set; }
    public int Quantity { get; set; }
    public string Unit { get; set; }
    public decimal Price { get; set; }
    public Vat Vat { get; set; }
    public decimal? Discount { get; set; }
    public string DiscMode { get; set; }
}

public static class ItemExtensions
{
    public static SoldGood ToEntity(this Item item, int sequenceNo)
    {
        var taxableAmount = item.DiscMode switch
        {
            "%" => Math.Round(item.Price, 2) * item.Quantity * (1 - (item.Discount / 100.0m) ?? 0.0m),
            _ => Math.Round(item.Price, 2) * item.Quantity - (item.Discount ?? 0.0m)
        };

        var vatAmount = item.Vat.Mode switch
        {
            "%" => taxableAmount * item.Vat.Value / 100.0m,
            _ => item.Vat.Value
        };

        var vatRate = item.Vat.Mode == "%" ? item.Vat.Value : vatAmount / taxableAmount * 100.0m;

        return new SoldGood
        {
            Description = item.Article,
            Quantity = item.Quantity,
            SequenceNo = sequenceNo,
            TaxableAmount = taxableAmount,
            TotalAmount = taxableAmount + vatAmount,
            UnitOfMeasure = item.Unit,
            UnitOfMeasureType = UnitOfMeasureType.UnitOfMeasureOther,
            VatAmount = vatAmount,
            VatRate = vatRate
        };
    }
}