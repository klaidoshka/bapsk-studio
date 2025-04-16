using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;

public class ExportedGoodsVerifiedGoods
{
    public required decimal Quantity { get; set; }
    public required decimal QuantityVerified { get; set; }
    public required int SequenceNo { get; set; }
    public required decimal TotalAmount { get; set; }
    public required string UnitOfMeasure { get; set; }
    public required UnitOfMeasureType UnitOfMeasureType { get; set; }
}

public static class ExportedGoodsVerifiedGoodsExtensions
{
    public static ExportedGoodsVerifiedGoods ToDto(this StiVatReturnDeclarationExportVerifiedGood good)
    {
        return new ExportedGoodsVerifiedGoods
        {
            Quantity = good.Quantity,
            QuantityVerified = good.QuantityVerified,
            SequenceNo = good.SequenceNo,
            TotalAmount = good.TotalAmount,
            UnitOfMeasure = good.UnitOfMeasure,
            UnitOfMeasureType = good.UnitOfMeasureType
        };
    }
    
    public static StiVatReturnDeclarationExportVerifiedGood ToEntity(this ExportedGoodsVerifiedGoods good)
    {
        return new StiVatReturnDeclarationExportVerifiedGood
        {
            Quantity = good.Quantity,
            QuantityVerified = good.QuantityVerified,
            SequenceNo = good.SequenceNo,
            TotalAmount = good.TotalAmount,
            UnitOfMeasure = good.UnitOfMeasure,
            UnitOfMeasureType = good.UnitOfMeasureType
        };
    }
}