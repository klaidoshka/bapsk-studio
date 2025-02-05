namespace Accounting.Contract.Sti.Data.ExportedGoods;

public class ExportedGoodsResponse
{
    public ResultStatus ResultStatus { get; set; }
    public DateTime ResultDate { get; set; }
    public IReadOnlyList<StiError>? Errors { get; set; }
    public ExportedGoodsInfo? Info { get; set; }
}