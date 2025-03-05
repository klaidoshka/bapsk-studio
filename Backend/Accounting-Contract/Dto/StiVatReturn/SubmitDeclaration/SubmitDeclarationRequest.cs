namespace Accounting.Contract.Dto.StiVatReturn.SubmitDeclaration;

/// <summary>
///     Request to submit or correct a tax-free declaration.
///     If providing a correction, the original declaration number must be provided.
///     However, correction number must also be provided, it must be higher than the
///     previous one.
///     Only accepted declarations can be corrected. If the declaration was submitted
///     for tax refund, then the same declaration cannot be corrected.
/// </summary>
public class SubmitDeclarationRequest
{
    /// <summary>
    ///     TaxFree declaration information
    /// </summary>
    public required SubmitDeclaration Declaration { get; set; }

    /// <summary>
    ///     Unique identifier for the request, 40 characters.
    /// </summary>
    public required string RequestId { get; set; }

    /// <summary>
    ///     Service consumer identification number. It may be
    ///     seller or intermediary's identification number.
    ///     9 characters for individuals,
    ///     10 characters for Sti identification number,
    ///     10 characters for foreigner identification number,
    ///     6-8 characters for individuals of individual activity identification number
    /// </summary>
    public required string SenderId { get; set; }

    /// <summary>
    ///     Length of 1 digit:
    ///     1 - When instant declaration is requested by the salesman.
    ///     2 - When deferred declaration is requested by the salesman,
    ///     since the buyer has been given a paper declaration.
    /// </summary>
    public required int Situation { get; set; }

    /// <summary>
    ///     When the request was created, yyyy-MM-ddTHH:mm:ss.
    /// </summary>
    public required DateTime TimeStamp { get; set; }
}