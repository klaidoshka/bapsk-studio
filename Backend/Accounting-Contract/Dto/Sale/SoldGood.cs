using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Sale;

public class SoldGood
{
    public string Description { get; set; }
    public int? Id { get; set; }
    public decimal Quantity { get; set; }
    public int SequenceNo { get; set; }
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
            TaxableAmount = Math.Round(soldGood.TaxableAmount, 2),
            TotalAmount = Math.Round(soldGood.TotalAmount, 2),
            UnitOfMeasure = soldGood.UnitOfMeasure,
            UnitOfMeasureType = soldGood.UnitOfMeasureType,
            VatAmount = Math.Round(soldGood.VatAmount, 2),
            VatRate = Math.Round(soldGood.VatRate, 2)
        };
    }

    public static SoldGoodCreateEdit ToDtoCreateEdit(this SoldGood soldGood)
    {
        return new SoldGoodCreateEdit
        {
            Description = soldGood.Description,
            Id = soldGood.Id,
            Quantity = soldGood.Quantity,
            UnitOfMeasure = soldGood.UnitOfMeasure,
            UnitOfMeasureType = soldGood.UnitOfMeasureType,
            UnitPrice = Math.Round(soldGood.TaxableAmount / soldGood.Quantity, 2),
            VatRate = Math.Round(soldGood.VatRate, 2)
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
            TaxableAmount = Math.Round(soldGood.TaxableAmount, 2),
            TotalAmount = Math.Round(soldGood.TotalAmount, 2),
            UnitOfMeasure = soldGood.UnitOfMeasure,
            UnitOfMeasureType = soldGood.UnitOfMeasureType,
            VatAmount = Math.Round(soldGood.VatAmount, 2),
            VatRate = Math.Round(soldGood.VatRate, 2)
        };
    }
}