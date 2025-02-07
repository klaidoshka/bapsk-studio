namespace Accounting.Contract.Sti.ExportedGoods;

/// <summary>
/// Request to query the information regarding declaration's goods
/// being (not)transported from EU.
///
/// Only non-cancelled declarations are considered.
/// </summary>
public class ExportedGoodsRequest
{
    /// <summary>
    /// Unique declaration identifier, 34 characters.
    /// </summary>
    public required string DocumentId { get; set; }

    /// <summary>
    /// Unique request identifier, 36 characters.
    /// </summary>
    public required string RequestId { get; set; }

    /// <summary>
    /// Service consumer identification number. It may be
    /// seller or intermediary's identification number.
    ///
    /// 9 characters for individuals,
    /// 10 characters for Sti identification number,
    /// 10 characters for foreigner identification number,
    /// 6-8 characters for individuals of individual activity identification number
    /// </summary>
    public required string SenderId { get; set; }

    /// <summary>
    /// When the request was created, yyyy-MM-ddTHH:mm:ss.
    /// </summary>
    public required DateTime TimeStamp { get; set; }
}