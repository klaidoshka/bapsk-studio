namespace Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;

public class ExportedGoodsRequest
{
    public required string DocumentId { get; set; }
    public required string RequestId { get; set; }
    public required string SenderId { get; set; }
    public required DateTime TimeStamp { get; set; }
}