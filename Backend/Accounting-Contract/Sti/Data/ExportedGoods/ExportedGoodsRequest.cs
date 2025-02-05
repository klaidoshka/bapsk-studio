namespace Accounting.Contract.Sti.Data.ExportedGoods;

public class ExportedGoodsRequest
{
    public string RequestId { get; set; }
    public DateTime TimeStamp { get; set; }
    public string SenderId { get; set; }
    public string DocumentId { get; set; }
}

public class ExportedGoodsVerifiedGoods
{
    public string SequenceNo { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal Quantity { get; set; }
    public string Item { get; set; }
    public ItemChoice ItemElementName { get; set; }
    public decimal QuantityVerified { get; set; }
    public decimal GrossValueVerified { get; set; }
}