using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Sale;

public class SoldGood
{
    public string Description { get; set; }
    public int? Id { get; set; }
    public int Quantity { get; set; }
    public string SequenceNo { get; set; }
    public decimal TaxableAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public string UnitOfMeasure { get; set; }
    public UnitOfMeasureType UnitOfMeasureType { get; set; }
    public decimal VatAmount { get; set; }
    public decimal VatRate { get; set; }
}

public static class SoldGoodExtensions
{
    public static SoldGood ToDto(this Entity.SoldGood soldGood)
    {
        return new SoldGood
        {
            Description = soldGood.Description,
            Id = soldGood.Id,
            Quantity = soldGood.Quantity,
            SequenceNo = soldGood.SequenceNo,
            TaxableAmount = soldGood.TaxableAmount,
            TotalAmount = soldGood.TotalAmount,
            UnitOfMeasure = soldGood.UnitOfMeasure,
            UnitOfMeasureType = soldGood.UnitOfMeasureType,
            VatAmount = soldGood.VatAmount,
            VatRate = soldGood.VatRate
        };
    }

    public static Entity.SoldGood ToEntity(this SoldGood soldGood)
    {
        return new Entity.SoldGood
        {
            Description = soldGood.Description,
            Id = soldGood.Id ?? 0,
            Quantity = soldGood.Quantity,
            SequenceNo = soldGood.SequenceNo,
            TaxableAmount = soldGood.TaxableAmount,
            TotalAmount = soldGood.TotalAmount,
            UnitOfMeasure = soldGood.UnitOfMeasure,
            UnitOfMeasureType = soldGood.UnitOfMeasureType,
            VatAmount = soldGood.VatAmount,
            VatRate = soldGood.VatRate
        };
    }
}