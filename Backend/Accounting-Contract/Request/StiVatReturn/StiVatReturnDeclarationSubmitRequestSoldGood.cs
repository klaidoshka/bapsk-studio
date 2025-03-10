using Accounting.Contract.Dto.StiVatReturn;

namespace Accounting.Contract.Request.StiVatReturn;

public class StiVatReturnDeclarationSubmitRequestSoldGood
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