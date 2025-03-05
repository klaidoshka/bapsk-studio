namespace Accounting.Contract.Dto.StiVatReturn.ExportedGoods;

public class ExportedGoodsVerifiedGoods
{
    public decimal GrossValueVerified { get; set; }

    /// <summary>
    ///     Quantity of the goods.
    /// </summary>
    public required decimal Quantity { get; set; }

    /// <summary>
    ///     Quantity of goods that were verified by the customs as appropriate
    ///     for refunding VAT. Must be less or equal to the Quantity.
    /// </summary>
    public required decimal QuantityVerified { get; set; }

    /// <summary>
    ///     Unique identifier of the exported goods in the declaration.
    /// </summary>
    public required string SequenceNo { get; set; }

    /// <summary>
    ///     Price of the goods (with VAT), Eur.
    /// </summary>
    public required decimal TotalAmount { get; set; }

    /// <summary>
    ///     If UnitOfMeasureType is Code, then this is the code of the
    ///     unit of measurement from the classification standard.
    ///     https://lrmuitine.lt/web/guest/548 (18th position),
    ///     3 characters.
    ///     But if type is Other, then this is the name of the unit of
    ///     measurement defined on the goods. Set it the same as in the
    ///     label, 50 characters.
    /// </summary>
    public required string UnitOfMeasure { get; set; }

    /// <summary>
    ///     Type of the measurement, either by classification code or
    ///     by free text (copying it down from the goods label).
    /// </summary>
    public required UnitOfMeasureType UnitOfMeasureType { get; set; }
}