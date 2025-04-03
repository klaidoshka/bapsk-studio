using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Sale;

public class SoldGoodCreateEdit
{
    public string Description { get; set; }
    public int? Id { get; set; }
    public decimal Quantity { get; set; }
    public decimal TotalPriceAdjusted => Math.Round(Quantity * UnitPrice, 2);
    public string UnitOfMeasure { get; set; }
    public UnitOfMeasureType UnitOfMeasureType { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal VatRate { get; set; }
}

public static class SoldGoodCreateEditExtensions
{
    public static Entity.SoldGood ToEntity(this SoldGoodCreateEdit soldGood)
    {
        var vatRate = Math.Round(soldGood.VatRate, 2);
        var taxableAmount = Math.Round(soldGood.Quantity * soldGood.UnitPrice, 2);
        var vatAmount = Math.Round(taxableAmount * vatRate / 100, 2);
        var totalAmount = Math.Round(taxableAmount + vatAmount, 2);
        
        return new Entity.SoldGood
        {
            Description = soldGood.Description,
            Id = soldGood.Id ?? 0,
            Quantity = soldGood.Quantity,
            TaxableAmount = taxableAmount,
            TotalAmount = totalAmount,
            UnitOfMeasure = soldGood.UnitOfMeasure,
            UnitOfMeasureType = soldGood.UnitOfMeasureType,
            VatAmount = vatAmount,
            VatRate = vatRate
        };
    }
}