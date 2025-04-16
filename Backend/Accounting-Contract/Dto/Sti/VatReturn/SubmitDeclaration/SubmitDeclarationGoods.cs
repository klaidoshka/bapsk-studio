using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclarationGoods
{
    public required string Description { get; set; }
    public required string UnitOfMeasure { get; set; }
    public required UnitOfMeasureType UnitOfMeasureType { get; set; }
    public required decimal Quantity { get; set; }
    public required int SequenceNo { get; set; }
    public required decimal TaxableAmount { get; set; }
    public required decimal TotalAmount { get; set; }
    public required decimal VatAmount { get; set; }
    public required decimal VatRate { get; set; }
}