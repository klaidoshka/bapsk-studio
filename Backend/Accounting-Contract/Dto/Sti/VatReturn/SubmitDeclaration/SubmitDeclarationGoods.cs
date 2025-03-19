using Accounting.Contract.Entity;

namespace Accounting.Contract.Dto.Sti.VatReturn.SubmitDeclaration;

public class SubmitDeclarationGoods
{
    /// <summary>
    ///     Item's description, 500 characters.
    /// </summary>
    public required string Description { get; set; }

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

    /// <summary>
    ///     Item's quantity, must be > 0.
    /// </summary>
    public required decimal Quantity { get; set; }

    /// <summary>
    ///     Item's unique sequence number in the declaration. Must be on the printed declaration
    ///     or shown in electronic form together with other declaration information.
    ///     4 digits (1-9999).
    /// </summary>
    public required int SequenceNo { get; set; }

    /// <summary>
    ///     Price without VAT (eur), 18 digits from which 2 decimal places.
    /// </summary>
    public required decimal TaxableAmount { get; set; }

    /// <summary>
    ///     Price with VAT (eur), 18 digits from which 2 decimal places.
    ///     Must be TaxableAmount + VatAmount.
    ///     1 eur mistake is allowed.
    /// </summary>
    public required decimal TotalAmount { get; set; }

    /// <summary>
    ///     VAT amount (eur), 18 digits from which 2 decimal places.
    ///     Must be TaxableAmount * VatRate / 100, rounded to 2 decimal places.
    ///     1 eur mistake is allowed.
    /// </summary>
    public required decimal VatAmount { get; set; }

    /// <summary>
    ///     VAT rate/percentage, 2 digits after decimal point.
    /// </summary>
    public required decimal VatRate { get; set; }
}