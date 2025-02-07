namespace Accounting.Contract.Sti.ExportedGoods;

public enum ExportedGoodsCustomsVerificationResultType
{
    /// <summary>
    /// All goods were exported
    /// </summary>
    A1,

    /// <summary>
    /// Some details were not met (broken package, different item, etc.)
    /// so not all goods were exported.
    /// </summary>
    A4
}