namespace Accounting.Contract.Dto.Sti.VatReturn.ExportedGoods;

public class ExportedGoodsResponse
{
    /// <summary>
    ///     Errors that occurred during the operation. Only exists if
    ///     operation is not successful.
    /// </summary>
    public required IReadOnlyList<StiError>? Errors { get; set; }

    /// <summary>
    ///     Information about the exported goods. Only exists if
    ///     operation is successful.
    /// </summary>
    public required ExportedGoodsInfo? Info { get; set; }

    /// <summary>
    ///     Response date-time, yyyy-MM-ddTHH:mm:ss.
    /// </summary>
    public required DateTime ResultDate { get; set; }

    /// <summary>
    ///     Result status of the operation, 8 characters.
    /// </summary>
    public required ResultStatus ResultStatus { get; set; }
}