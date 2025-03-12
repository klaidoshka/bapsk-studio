using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Sale;

public class SoldGoodCreateEdit
{
    public string Description { get; set; }
    public int? Id { get; set; }
    public int Quantity { get; set; }
    public string SequenceNo { get; set; }
    public string UnitOfMeasure { get; set; }
    public UnitOfMeasureType UnitOfMeasureType { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal VatRate { get; set; }
}

public static class SoldGoodCreateEditExtensions
{
    public static Entity.SoldGood ToEntity(this SoldGoodCreateEdit soldGood)
    {
        var taxableAmount = soldGood.Quantity * soldGood.UnitPrice;
        var vatAmount = taxableAmount * soldGood.VatRate;
        var totalAmount = taxableAmount + vatAmount;
        
        return new Entity.SoldGood
        {
            Description = soldGood.Description,
            Id = soldGood.Id ?? 0,
            Quantity = soldGood.Quantity,
            SequenceNo = soldGood.SequenceNo,
            TaxableAmount = taxableAmount,
            TotalAmount = totalAmount,
            UnitOfMeasure = soldGood.UnitOfMeasure,
            UnitOfMeasureType = soldGood.UnitOfMeasureType,
            VatAmount = vatAmount,
            VatRate = soldGood.VatRate
        };
    }
}